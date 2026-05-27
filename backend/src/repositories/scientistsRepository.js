import { Edition } from '../models/Edition.js'
import { ScientistInvitation } from '../models/roles/ScientistInvitation.js'
import { UserProfile } from '../models/UserProfile.js'
import { Seed } from '../models/Seed.js'
import { ROLES } from '../services/Roles.js'

export async function getScientistInvitation (email, editionId, seedId) {
  return await ScientistInvitation.findOrCreate({ where: { email, editionId, seedId } })
}

export async function getScientistInvitationsByUser (user) {
  return await ScientistInvitation.findAll({
    where: {
      email: user?.email
    }
  })
}

export async function removeScientistInvitationsOfUser (user) {
  return await ScientistInvitation.destroy({
    where: {
      email: user?.email
    }
  })
}

export async function removeScientistFromEdition (scientist, editionId) {
  return await scientist.removeEdition(editionId)
}

export async function addScientistToEdition (scientist, editionId) {
  return await scientist.addEdition(editionId)
}

export async function isScientistEnrolledToEdition (scientist, editionId) {
  return (await scientist.getEditions()).some(e => e.id === editionId)
}

export async function addSeedToScientist (scientist, seedId) {
  return await scientist.addSeed(seedId)
}

export async function getScientistsOfEdition (editionId) {
  const whereClause = editionId
    ? { id: editionId }
    : { }

  return await UserProfile.scope(ROLES.PUBLIC.name).findAll({
    include: [
      {
        model: Edition.scope(ROLES.STAFF.name),
        where: whereClause,
        through: { attributes: [] },
        attributes: ['name'],
        required: true
      }
    ]
  })
}

export async function getScientistSeedsOfEdition (scientistId, editionId) {
  return await Seed.findAll({
    attributes: ['id', 'title', 'mainImage'],
    include: [
      {
        model: UserProfile,
        where: { id: scientistId },
        attributes: [],
        required: true
      },
      {
        model: Edition,
        where: { id: editionId },
        attributes: [],
        required: true
      }
    ]
  })
}
