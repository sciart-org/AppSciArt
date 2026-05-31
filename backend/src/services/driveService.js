import { PassThrough } from 'stream'
import { loadDriveAuthConfig } from '../config/drive.js'
import { toPlainObject } from './mappers/utils.js'
import { errorThrower } from './errorThrower.js'

const ROOT_FOLDER_ID = process.env.DRIVE_FOLDER_ID

let driveInstance = await loadDriveAuthConfig()

export const reloadDriveInstance = async () => {
  driveInstance = await loadDriveAuthConfig()
}

const drive = new Proxy({}, {
  get: (_, prop) => new Proxy({}, {
    get: (_, method) => async (...args) => {
      try {
        return await driveInstance[prop][method](...args)
      } catch (error) {
        if (error.response?.status === 400 || error.code === 400) {
          console.log('Refreshing auth...')
          await reloadDriveInstance()
          try {
            return await driveInstance[prop][method](...args)
          } catch (retryError) {
            errorThrower(
              retryError.response?.data?.error === 'invalid_grant',
              'Google OAuth token expired or revoked. Re-authorization required.',
              401
            )
            console.error('Drive retry error:', { message: retryError.message, status: retryError.response?.status })
            throw retryError
          }
        }
        throw error
      }
    }
  })
})

const createReaderLink = async (id) => {
  await drive.permissions.create({
    fileId: id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })
}

const createWriterLink = async (id) => {
  await drive.permissions.create({
    fileId: id,
    requestBody: {
      role: 'writer',
      type: 'anyone'
    }
  })
}

export const getProductsWithTemplate = async (products, templateName) => {
  return Promise.all(products.map(async (product) => {
    if (!product.driveLink) return { ...toPlainObject(product), template: null }
    const folderId = extractDriveFolderId(product.driveLink)
    const templateId = await findFileInFolder(folderId, templateName)
    return { ...toPlainObject(product), template: templateId ? getDocUrl(templateId) : null }
  }))
}

export const getFlowerRubrics = async (evaluatorName, flowers) => {
  return Promise.all(flowers.map(async (flower) => {
    const plainFlower = toPlainObject(flower)
    const noRubric = { flowerId: plainFlower.id, rubric: null }

    if (!flower.driveLink) return noRubric

    const flowerFolderId = extractDriveFolderId(flower.driveLink)
    const rubricsFolderId = await findFileInFolder(flowerFolderId, 'rubrics')

    if (!rubricsFolderId) return noRubric

    const rubricName = `rubric-${parseFolderName(evaluatorName)}`
    const rubricId = await findFileInFolder(rubricsFolderId, rubricName)

    return {
      flowerId: plainFlower.id,
      rubric: rubricId ? getDocUrl(rubricId) : null
    }
  }))
}

const extractDriveFolderId = (driveLink) => {
  const match = driveLink.match(/[-\w]{25,}/)
  if (!match) return null
  return match[0]
}

const getImgUrl = (fileId) => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s4000`
}

const getDocUrl = (docId) => {
  return `https://docs.google.com/document/d/${docId}/edit?embedded=true&rm=demo`
}

const buildImgMedia = (imgB64) => {
  const matches = imgB64.match(/^data:(.+);base64,(.+)$/)
  if (!matches) throw new Error('Invalid image format')

  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  const stream = new PassThrough()
  stream.end(buffer)

  return {
    mimeType,
    body: stream
  }
}

const findFileInFolder = async (folderId, fileName, exact = false) => {
  const nameQuery = exact ? `name = '${fileName}'` : `name contains '${fileName}'`
  const res = await drive.files.list({
    q: `'${folderId}' in parents and ${nameQuery} and trashed = false`,
    fields: 'files(id)',
    pageSize: 1
  })
  return res.data.files[0]?.id ?? null
}

export const getImgFromDrive = async (driveLink, imageName = 'logo') => {
  const folderId = extractDriveFolderId(driveLink)
  const imageId = await findFileInFolder(folderId, imageName)
  return imageId ? getImgUrl(imageId) : null
}

const deleteOldImg = async (newImgId, folderId, imageName) => {
  const existingFiles = await drive.files.list({
    q: `'${folderId}' in parents and name = '${imageName}' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  const files = existingFiles.data.files || []

  for (const file of files) {
    if (file.id === newImgId) continue
    await drive.files.delete({ fileId: file.id })
  }
}

export const uploadImg = async (imgB64, driveLink, imageName = 'logo.png') => {
  if (!imgB64) return null
  const folderId = extractDriveFolderId(driveLink)

  const media = buildImgMedia(imgB64)
  const fileMetadata = {
    name: imageName,
    parents: [folderId]
  }

  const uploadedImg = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id'
  })

  const newImgId = uploadedImg.data.id

  await deleteOldImg(newImgId, folderId, imageName)

  return getImgUrl(newImgId)
}

export const parseFolderName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const createEditionFolderName = (year, name) => {
  return `${year}-${parseFolderName(name)}`
}

const getOrCreateFolder = async (parentFolderId, folderName) => {
  const folder = await drive.files.list({
    q: `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  if (folder.data.files.length > 0) {
    return folder.data.files[0].id
  } else {
    const createdFolder = await createFolderGeneric(folderName, parentFolderId)
    return createdFolder.data.id
  }
}

const createFolderGeneric = async (folderName, parentId) => {
  return await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    },
    fields: 'id, name'
  })
}

const createEditionFolder = async (folderName) => {
  const editionsFolderId = await getOrCreateFolder(ROOT_FOLDER_ID, 'editions')
  const editionFolder = await createFolderGeneric(folderName, editionsFolderId)
  await createReaderLink(editionFolder.data.id)
  return editionFolder.data
}

const createHackathonFolder = async (folderName, editionFolderId) => {
  if (!editionFolderId) return null
  const editionHackathonsFolderId = await getOrCreateFolder(editionFolderId, 'hackathons')
  const hackathonFolder = await createFolderGeneric(folderName, editionHackathonsFolderId)
  await createReaderLink(hackathonFolder.data.id)
  return hackathonFolder.data
}

const copyFileToFolder = async (fileId, folderId, newName) => {
  const res = await drive.files.copy({
    fileId,
    requestBody: {
      name: newName,
      parents: [folderId]
    },
    fields: 'id'
  })
  return res.data.id
}

const createFlowerFolder = async (folderName, flowersFolderId, hackathonFolderId) => {
  const flowerTemplateFileId = await findFileInFolder(hackathonFolderId, 'flowerTemplate')
  const flowerFolder = await createFolderGeneric(folderName, flowersFolderId)
  const copiedFileId = await copyFileToFolder(flowerTemplateFileId, flowerFolder.data.id, 'flowerTemplate')
  await Promise.all([
    createReaderLink(flowerFolder.data.id),
    copiedFileId && createWriterLink(copiedFileId)
  ])
  return flowerFolder.data
}

export const createFlowerRubrics = async (evaluatorNames, hackathonDriveLink) => {
  const hackathonFolderId = extractDriveFolderId(hackathonDriveLink)
  const rubricTemplateFileId = await findFileInFolder(hackathonFolderId, 'rubricTemplate')
  const flowersFolderId = await getOrCreateFolder(hackathonFolderId, 'flowers')
  const flowerFolders = await drive.files.list({
    q: `'${flowersFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })
  await Promise.all(
    flowerFolders.data.files.map(async (flowerFolder) => {
      const rubricsFolderId = await getOrCreateFolder(flowerFolder.id, 'rubrics')

      await Promise.all(
        evaluatorNames.map(async (evaluatorName) => {
          const rubricName = `rubric-${parseFolderName(evaluatorName)}`
          const copiedFileId = await copyFileToFolder(rubricTemplateFileId, rubricsFolderId, rubricName)
          await createWriterLink(copiedFileId)
        })
      )
    })
  )
}

const createDriveFolderLink = (editionFolderId) => {
  return `https://drive.google.com/drive/folders/${editionFolderId}`
}

export const updateFolderName = async (driveLink, newName) => {
  const folderId = extractDriveFolderId(driveLink)
  await drive.files.update({
    fileId: folderId,
    requestBody: {
      name: newName
    },
    fields: 'id, name'
  })
}

export const getEntitiesWithImage = async (entitiesList, Model, imageName = 'logo') => {
  const validEntities = entitiesList.filter(Boolean)
  const driveLinks = await Model.unscoped().findAll({
    where: { id: validEntities.map(e => e.id) },
    attributes: ['id', 'driveLink']
  })
  const driveLinkMap = Object.fromEntries(driveLinks.map(e => [e.id, e.driveLink]))
  return Promise.all(
    validEntities.map(async (entity) => {
      const driveLink = driveLinkMap[entity.id]
      if (!driveLink) return { ...toPlainObject(entity), [imageName]: null }
      try {
        const image = await getImgFromDrive(driveLink, imageName)
        return { ...toPlainObject(entity), [imageName]: image }
      } catch (err) {
        if (err.status === 401 || err.message === 'REAUTH_REQUIRED') {
          console.warn('Drive auth expired, skipping image for entity:', entity.id)
          return { ...toPlainObject(entity), [imageName]: null }
        }
        throw err
      }
    })
  )
}

const createEmptyDoc = async (folderId, name) => {
  await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.document',
      parents: [folderId]
    }
  })
}

export const createDriveEdition = async (year, name, logo) => {
  const folderName = createEditionFolderName(year, name)
  const editionFolder = await createEditionFolder(folderName)
  const editionFolderId = editionFolder.id
  const driveLink = createDriveFolderLink(editionFolderId)
  await Promise.all([
    createFolderGeneric('seeds', editionFolderId),
    uploadImg(logo, driveLink),
    createEmptyDoc(editionFolderId, 'seedTemplate')
  ])
  return driveLink
}

export const createDriveHackathon = async (editionDriveLink, internalName, logo) => {
  const folderName = parseFolderName(internalName)
  const editionFolderId = extractDriveFolderId(editionDriveLink)
  const hackathonFolder = await createHackathonFolder(folderName, editionFolderId)
  const driveLink = createDriveFolderLink(hackathonFolder.id)
  await Promise.all([
    createFolderGeneric('flowers', hackathonFolder.id),
    uploadImg(logo, driveLink),
    createEmptyDoc(hackathonFolder.id, 'flowerTemplate')
  ])
  return driveLink
}

export const createDriveSeed = async (editionDriveLink, seedTitle, mainImage = undefined) => {
  const folderName = parseFolderName(seedTitle)
  const editionFolderId = extractDriveFolderId(editionDriveLink)
  const editionSeedsFolderId = await getOrCreateFolder(editionFolderId, 'seeds')
  const seedFolder = await createFolderGeneric(folderName, editionSeedsFolderId)
  const seedFolderId = seedFolder.data.id
  const driveLink = createDriveFolderLink(seedFolderId)
  const seedTemplateFileId = await findFileInFolder(editionFolderId, 'seedTemplate')
  const tasks = [
    createReaderLink(seedFolderId),
    createFolderGeneric('images', seedFolderId),
    copyFileToFolder(seedTemplateFileId, seedFolderId, 'seedTemplate')
  ]
  if (mainImage) {
    tasks.push(uploadImg(mainImage, driveLink, 'mainImage.png'))
  }
  await Promise.all(tasks)
  return driveLink
}

export const createDriveFlower = async (hackathonDriveLink, teamNumber, seedTitle) => {
  const folderName = parseFolderName(`Team ${teamNumber} - ${seedTitle}`)
  const hackathonFolderId = extractDriveFolderId(hackathonDriveLink)
  const flowersFolderId = await getOrCreateFolder(hackathonFolderId, 'flowers')
  const flowerFolder = await createFlowerFolder(folderName, flowersFolderId, hackathonFolderId)
  return createDriveFolderLink(flowerFolder.id)
}

export const moveDriveFolder = async (folderDriveLink, targetEditionDriveLink) => {
  const folderId = extractDriveFolderId(folderDriveLink)
  const targetEditionId = extractDriveFolderId(targetEditionDriveLink)

  const currentFolder = await drive.files.get({ fileId: folderId, fields: 'parents' })
  const targetParentId = await getOrCreateFolder(targetEditionId, 'hackathons')

  const previousParents = currentFolder.data.parents?.join(',')

  await drive.files.update({
    fileId: folderId,
    addParents: targetParentId,
    removeParents: previousParents,
    fields: 'id, parents'
  })
}
