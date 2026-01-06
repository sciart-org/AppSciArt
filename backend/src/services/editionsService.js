import { Edition } from '../models/Edition.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { mapToEditionDetails } from './mappers/editionMapper.js'
import { includeEditionFruits } from './includes/editionIncludes.js'
import { errorThrower } from './errorThrower.js'
import { createDriveEdition } from './driveService.js'
import { drive } from '../config/drive.js'

const getEditionsWithLogo = async (editionList) => {
  const editionsWithLogo = await Promise.all(
    editionList.map(async (edition) => {
      const logo = edition.driveLink
        ? await getLogoFromDrive(edition.driveLink)
        : null

      return {
        ...edition.toJSON(),
        logo
      }
    })
  )

  return editionsWithLogo
}

export const getLogoFromDrive = async (driveLink) => {
  if (!driveLink) return null

  const match = driveLink.match(/[-\w]{25,}/)
  if (!match) return null
  const folderId = match[0]

  const res = await drive.files.list({
    q: `'${folderId}' in parents and name contains 'logo' and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 1
  })

  if (!res.data.files || res.data.files.length === 0) {
    return null
  }

  const logoFile = res.data.files[0]

  return `https://drive.google.com/thumbnail?id=${logoFile.id}&sz=s4000`
}

export async function getEditions (userId) {
  const showUnpublished = await checkIsStaff(userId)
  const editions = await Edition.findAll({
    attributes: {
      exclude: ['longDescription', 'catalogLink']
    },
    where: showUnpublished ? {} : { state: 'PUBLISHED' },
    order: [['year', 'DESC']]
  })

  const editionsWithLogo = await getEditionsWithLogo(editions)
  return editionsWithLogo
}

export async function createEdition (userId, body) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create an edition', 403)
  const { name, year, logo, shortDescription, longDescription } = body
  const alreadyExists = await Edition.findOne({ where: { name }, attributes: ['id'] })
  errorThrower(alreadyExists, `Edition with name '${name}' already exists`, 409)
  const editionFolderId = await createDriveEdition(year, name, logo)
  const driveLink = `https://drive.google.com/drive/folders/${editionFolderId}`
  const createdEdition = await Edition.create({
    name,
    year,
    driveLink,
    shortDescription,
    longDescription
  })
  return createdEdition
}

export async function getEditionDetails (userId, editionId) {
  await validateEditionById(userId, editionId)
  const edition = await Edition.findByPk(editionId, {
    include: includeEditionFruits
  })
  const editionDetails = mapToEditionDetails(edition)

  const editionsWithLogo = await getEditionsWithLogo([editionDetails])
  return editionsWithLogo[0]
}

export function updateEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for updateEdition'
  })
}

export function deleteEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteEdition'
  })
}

export function publishEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for publishEdition'
  })
}

export function getEditionMethodology (req, res) {
  res.send({
    message: 'This is the mockup controller for getEditionMethodology'
  })
}
