import { query } from '../db.js'
import {
  childNamed, createDocument, createFolder, createImage, driveApi, folderIdFromLink, folderLink, DOCUMENT_MIME
} from '../fakes/driveStore.js'

export const SEED_TEMPLATE = 'seedTemplate'
export const FLOWER_TEMPLATE = 'flowerTemplate'
export const LOGO_IMAGE = 'logo.png'

const rootFolderId = () => process.env.DRIVE_FOLDER_ID

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const existingOrNewFolder = (parentId, name) => childNamed(parentId, name) ?? createFolder(name, parentId)

const copyTemplateInto = async (sourceFolderId, templateName, targetFolderId) => {
  const master = childNamed(sourceFolderId, templateName)
  if (!master) throw new Error(`No "${templateName}" master template in Drive folder ${sourceFolderId}`)
  await driveApi.files.copy({ fileId: master.id, requestBody: { name: templateName, parents: [targetFolderId] } })
}

export const createEditionFolders = ({ year, name, logo }) => {
  const editionsFolder = existingOrNewFolder(rootFolderId(), 'editions')
  const editionFolder = createFolder(`${year}-${slug(name)}`, editionsFolder.id)
  createFolder('seeds', editionFolder.id)
  createDocument(SEED_TEMPLATE, editionFolder.id)
  if (logo) createImage(LOGO_IMAGE, editionFolder.id)
  return folderLink(editionFolder.id)
}

export const createSeedFolders = async ({ editionDriveLink, title }) => {
  const editionFolderId = folderIdFromLink(editionDriveLink)
  const seedFolder = createFolder(slug(title), existingOrNewFolder(editionFolderId, 'seeds').id)
  createFolder('images', seedFolder.id)
  await copyTemplateInto(editionFolderId, SEED_TEMPLATE, seedFolder.id)
  return folderLink(seedFolder.id)
}

export const createHackathonFolders = ({ editionDriveLink, internalName }) => {
  const editionFolderId = folderIdFromLink(editionDriveLink)
  const hackathonFolder = createFolder(slug(internalName), existingOrNewFolder(editionFolderId, 'hackathons').id)
  createFolder('flowers', hackathonFolder.id)
  createDocument(FLOWER_TEMPLATE, hackathonFolder.id)
  return folderLink(hackathonFolder.id)
}

export const createFlowerFolders = async ({ hackathonDriveLink, teamNumber, seedTitle }) => {
  const hackathonFolderId = folderIdFromLink(hackathonDriveLink)
  const flowersFolder = existingOrNewFolder(hackathonFolderId, 'flowers')
  const flowerFolder = createFolder(slug(`Team ${teamNumber} - ${seedTitle}`), flowersFolder.id)
  await copyTemplateInto(hackathonFolderId, FLOWER_TEMPLATE, flowerFolder.id)
  return folderLink(flowerFolder.id)
}

const driveFolderIdOf = async (table, id) => {
  const { rows: [row] } = await query(`SELECT "driveLink" FROM ${table} WHERE id = $1`, [id])
  return folderIdFromLink(row?.driveLink)
}

const documentNamed = (folderId, name) => {
  const file = folderId && childNamed(folderId, name)
  return file?.mimeType === DOCUMENT_MIME ? file : undefined
}

export const drive = {
  seedMasterTemplateOf: async (edition) => documentNamed(await driveFolderIdOf('public.editions', edition.id), SEED_TEMPLATE),
  seedTemplateOf: async (seed) => documentNamed(await driveFolderIdOf('public.seeds', seed.id), SEED_TEMPLATE),
  flowerMasterTemplateOf: async (hackathon) => documentNamed(await driveFolderIdOf('public.hackathons', hackathon.id), FLOWER_TEMPLATE),
  flowerTemplateOf: async (flower) => documentNamed(await driveFolderIdOf('public.flowers', flower.id), FLOWER_TEMPLATE)
}
