import { Edition } from '../models/Edition.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateCanBeAnnounced, validateCanEditEdition, validateCanSeeEdition, validateEditionNameUnique } from '../validators/editionValidators.js'
import { mapToEditionDetails } from './mappers/editionMapper.js'
import { includeEditionFruits } from './includes/editionIncludes.js'
import { errorThrower } from './errorThrower.js'
import { createDriveEdition, getLogoFromDrive, updateFolderName, uploadImg } from './driveService.js'
import { toPlainObject } from './mappers/utils.js'
import { Op } from 'sequelize'

const getEditionsWithLogo = async (editionList) => {
  const editionsWithLogo = await Promise.all(
    editionList.map(async (edition) => {
      const logo = edition.driveLink
        ? await getLogoFromDrive(edition.driveLink)
        : null

      return {
        ...toPlainObject(edition),
        logo
      }
    })
  )

  return editionsWithLogo
}

export async function getEditions (userId, state) {
  const showPlannedEditions = await checkIsStaff(userId)

  const whereClause = {}

  if (!showPlannedEditions) {
    whereClause.state = state
      ? { [Op.and]: [state, { [Op.ne]: 'PLANNED' }] }
      : { [Op.ne]: 'PLANNED' }
  } else if (state) {
    whereClause.state = state
  }

  const editions = await Edition.findAll({
    attributes: {
      exclude: ['longDescription', 'catalogLink']
    },
    where: whereClause,
    order: [['year', 'DESC']]
  })

  const editionsWithLogo = await getEditionsWithLogo(editions)
  return editionsWithLogo
}

export async function createEdition (userId, body) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create an edition', 403)
  const { name, year, logo, shortDescription, longDescription } = body
  await validateEditionNameUnique(name)
  const driveLink = await createDriveEdition(year, name, logo)
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
  await validateCanSeeEdition(userId, editionId)
  const edition = await Edition.findByPk(editionId, {
    include: includeEditionFruits
  })
  const editionDetails = mapToEditionDetails(edition)

  const editionsWithLogo = await getEditionsWithLogo([editionDetails])
  return editionsWithLogo[0]
}

export async function updateEdition (currentUserId, editionId, body) {
  const edition = await validateCanEditEdition(currentUserId, editionId)

  const { name, year, logo, shortDescription, longDescription } = body
  await validateEditionNameUnique(name || '', editionId)

  const editionBody = { name, year, shortDescription, longDescription }
  let updatedEdition

  if (!Object.values(editionBody).every(v => v === undefined)) {
    updatedEdition = await edition.update(editionBody)
  }

  if (name || year) {
    const { driveLink, year, name } = updatedEdition
    await updateFolderName(driveLink, year, name)
  }

  if (logo) {
    const editionToUse = updatedEdition || (await Edition.findByPk(editionId, { attributes: ['driveLink'] }))
    await uploadImg(logo, editionToUse.driveLink)
  }

  return getEditionDetails(currentUserId, editionId)
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

export async function announceEdition (currentUserId, editionId) {
  const edition = await validateCanBeAnnounced(currentUserId, editionId)
  edition.state = 'ACTIVE'
  await edition.save()
  return edition
}
