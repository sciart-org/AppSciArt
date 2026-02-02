import { PassThrough } from 'stream'
import { drive } from '../config/drive.js'

const ROOT_FOLDER_ID = process.env.DRIVE_FOLDER_ID

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

export const uploadImg = async (imgB64, driveId) => {
  if (!imgB64) return null
  const folderId = extractDriveFolderId(driveId)

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

const parseEditionName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const createFolderName = (year, name) => {
  return `${year}-${parseEditionName(name)}`
}

const createEditionFolder = async (folderName) => {
  const editionsFolder = await drive.files.list({
    q: `'${ROOT_FOLDER_ID}' in parents and name = 'editions' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  let editionsFolderId

  if (editionsFolder.data.files.length > 0) {
    editionsFolderId = editionsFolder.data.files[0].id
  } else {
    const createdEditionsFolder = await drive.files.create({
      requestBody: {
        name: 'editions',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [ROOT_FOLDER_ID]
      },
      fields: 'id'
    })
    editionsFolderId = createdEditionsFolder.data.id
  }

  const editionFolder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [editionsFolderId]
    },
    fields: 'id, name'
  })

  await createReaderLink(editionFolder.data.id)

  return editionFolder.data
}
const createDriveFolderLink = (editionFolderId) => {
  return `https://drive.google.com/drive/folders/${editionFolderId}`
}

export const updateFolderName = async (driveLink, year, name) => {
  const folderId = extractDriveFolderId(driveLink)
  await drive.files.update({
    fileId: folderId,
    requestBody: {
      name: createFolderName(year, name)
    },
    fields: 'id, name'
  })
}

export const createDriveEdition = async (year, name, logo) => {
  const folderName = createFolderName(year, name)
  const editionFolder = await createEditionFolder(folderName)
  const driveLink = createDriveFolderLink(editionFolder.id)
  await uploadImg(logo, driveLink)
  return driveLink
}
