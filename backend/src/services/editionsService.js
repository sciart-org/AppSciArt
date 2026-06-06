import { Edition } from '../models/Edition.js'
import { validateEditionNameUnique } from '../validators/editionValidators.js'
import { errorThrower } from './errorThrower.js'
import { createEditionFolderName, getEntitiesWithImage, updateFolderName, uploadImg } from './driveService.js'
import * as EditionsRepository from '../repositories/editionsRepository.js'
import { checkExists } from '../validators/generalValidators.js'
import { ROLES } from './Roles.js'

const getEditionsWithLogo = async (editions) => {
  return await getEntitiesWithImage(editions, Edition)
}

export async function getEditions (userId, states) {
  const editions = await EditionsRepository.getEditions({ states, userId })
  const editionsWithLogo = await getEditionsWithLogo(editions)
  return editionsWithLogo
}

export async function createEdition (editionBody) {
  const { name, year, shortDescription, longDescription, driveLink } = editionBody
  const createdEdition = await Edition.create({
    name,
    year,
    shortDescription,
    longDescription,
    driveLink
  })
  return createdEdition
}

export async function getEditionDetails (userId, editionId) {
  const edition = await EditionsRepository.getEditionDetails(editionId, { userId })
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  const editionsWithLogo = await getEditionsWithLogo([edition])
  return editionsWithLogo[0]
}

export async function updateEdition (editionId, body) {
  const edition = await EditionsRepository.getMinimalEdition(editionId, { role: ROLES.STAFF })
  errorThrower(!checkExists(edition), 'Edition not found', 404)

  const { name, year, logo, shortDescription, longDescription } = body

  if (name) {
    await validateEditionNameUnique(name, editionId)
  }

  const editionBody = { name, year, shortDescription, longDescription }

  if (Object.values(editionBody).some(v => v !== undefined)) {
    await edition.update(editionBody)
  }

  if (name || year) {
    const { driveLink, year, name } = edition
    const newFolderName = createEditionFolderName(year, name)
    await updateFolderName(driveLink, newFolderName)
  }

  if (logo) {
    await uploadImg(logo, edition.driveLink)
  }

  return edition
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

export async function announceEdition (editionId) {
  const edition = await EditionsRepository.getEditionDetails(editionId, { role: ROLES.STAFF })
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  errorThrower(edition.state !== 'PLANNED', 'This edition is already announced', 400)

  edition.state = 'ACTIVE'
  await edition.save()
  return edition
}
