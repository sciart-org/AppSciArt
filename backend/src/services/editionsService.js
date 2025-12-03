import { Edition } from '../models/Edition.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { mapToEditionDetails } from './mappers/editionMapper.js'
import { includeEditionFruits } from './includes/editionIncludes.js'
import { errorThrower } from './errorThrower.js'

export async function getEditions (userId) {
  const showUnpublished = await checkIsStaff(userId)
  const editions = await Edition.findAll({
    attributes: {
      exclude: ['longDescription', 'catalogLink']
    },
    where: showUnpublished ? {} : { state: 'PUBLISHED' },
    order: [['year', 'DESC']]
  })
  return editions
}

export async function createEdition (userId, body) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create an edition', 403)
  const { name, year, logo, shortDescription, longDescription } = body
  const alreadyExists = await Edition.findOne({ where: { name }, attributes: ['id'] })
  errorThrower(alreadyExists, `Edition with name '${name}' already exists`, 409)
  // create folder in gDrive
  // upload logo to gDrive
  const logoUrl = null
  const createdEdition = await Edition.create({
    name,
    year,
    logo: logoUrl,
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
  return mapToEditionDetails(edition)
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
