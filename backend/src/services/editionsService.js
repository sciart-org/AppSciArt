import { Edition } from '../models/Edition.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { mapToEditionDetails } from './mappers/editionMapper.js'
import { includeEditionFruits } from './includes/editionIncludes.js'

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

export async function createEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for createEdition'
  })
}

export async function getEditionDetails (userId, editionId) {
  await validateEditionById(userId, editionId)
  const edition = await Edition.findByPk(editionId, {
    attributes: { exclude: ['shortDescription'] },
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
