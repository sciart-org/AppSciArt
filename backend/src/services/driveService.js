import { PassThrough } from 'stream'
import { loadDriveAuthConfig } from '../config/drive.js'
import { toPlainObject } from './mappers/utils.js'

const ROOT_FOLDER_ID = process.env.DRIVE_FOLDER_ID

let driveInstance = await loadDriveAuthConfig()

const drive = new Proxy({}, {
  get: (_, prop) => new Proxy({}, {
    get: (_, method) => async (...args) => {
      try {
        return await driveInstance[prop][method](...args)
      } catch (error) {
        if (error.response?.status === 400 || error.code === 400) {
          console.log('Refreshing auth...')
          driveInstance = await loadDriveAuthConfig()
          return await driveInstance[prop][method](...args)
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

const extractDriveFolderId = (driveLink) => {
  const match = driveLink.match(/[-\w]{25,}/)
  if (!match) return null
  return match[0]
}

const getImgUrl = (fileId) => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s4000`
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

export const getLogoFromDrive = async (driveLink) => {
  const folderId = extractDriveFolderId(driveLink)

  const res = await drive.files.list({
    q: `'${folderId}' in parents and name contains 'logo' and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 1
  })

  if (!res.data.files || res.data.files.length === 0) {
    return null
  }

  const logoFile = res.data.files[0]

  return getImgUrl(logoFile.id)
}

const deleteOldImg = async (newImgId, folderId) => {
  const existingFiles = await drive.files.list({
    q: `'${folderId}' in parents and name = 'logo.png' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  const files = existingFiles.data.files || []

  for (const file of files) {
    if (file.id === newImgId) continue
    await drive.files.delete({ fileId: file.id })
  }
}

export const uploadImg = async (imgB64, driveLink) => {
  if (!imgB64) return null
  const folderId = extractDriveFolderId(driveLink)

  const media = buildImgMedia(imgB64)
  const fileMetadata = {
    name: 'logo.png',
    parents: [folderId]
  }

  const uploadedImg = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id'
  })

  const newImgId = uploadedImg.data.id

  await deleteOldImg(newImgId, folderId)

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

export const getEntitiesWithLogo = async (entitiesList) => {
  const entitiesWithLogo = await Promise.all(
    entitiesList.map(async (entity) => {
      if (!entity?.driveLink) return toPlainObject(entity)
      const logo = await getLogoFromDrive(entity.driveLink)

      return {
        ...toPlainObject(entity),
        logo
      }
    })
  )

  return entitiesWithLogo
}

export const createDriveEdition = async (year, name, logo) => {
  const folderName = createEditionFolderName(year, name)
  const editionFolder = await createEditionFolder(folderName)
  const driveLink = createDriveFolderLink(editionFolder.id)
  await uploadImg(logo, driveLink)
  return driveLink
}

export const createDriveHackathon = async (editionDriveLink, internalName, logo) => {
  const folderName = parseFolderName(internalName)
  const editionFolderId = extractDriveFolderId(editionDriveLink)
  const hackathonFolder = await createHackathonFolder(folderName, editionFolderId)
  const driveLink = createDriveFolderLink(hackathonFolder.id)
  await uploadImg(logo, driveLink)
  return driveLink
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
