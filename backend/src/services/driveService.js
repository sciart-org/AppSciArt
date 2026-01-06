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

const createFolderName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const uploadImg = async (imgB64, folderId) => {
  if (!imgB64) return null

  const matches = imgB64.match(/^data:(.+);base64,(.+)$/)
  if (!matches) throw new Error('Invalid base64 image')

  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  const stream = new PassThrough()
  stream.end(buffer)

  const fileMetadata = {
    name: 'logo.png',
    parents: [folderId]
  }

  const media = {
    mimeType,
    body: stream
  }

  const uploadedImg = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id'
  })

  return `https://drive.google.com/thumbnail?id=${uploadedImg.data.id}&sz=s4000`
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

export const createDriveEdition = async (year, name, logo) => {
  const folderName = `${year}-${createFolderName(name)}`
  const editionFolder = await createEditionFolder(folderName)
  await uploadImg(logo, editionFolder.id)
  return editionFolder.id
}
