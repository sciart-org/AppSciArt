import { Edition } from '../models/Edition.js'
import { ScientistInvitation } from '../models/roles/ScientistInvitation.js'
import { UserProfile } from '../models/UserProfile.js'
import { Seed } from '../models/Seed.js'
import { getUserRole, INTERNAL_BACKEND_ROLE, ROLES } from '../services/Roles.js'
import { SeedScientists } from '../models/intermediate/SeedScientists.js'
import { checkExists } from '../validators/generalValidators.js'

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

export function getEditionsOfScientist (scientistId, { states = [] } = {}) {
  const scopes = [INTERNAL_BACKEND_ROLE.name]
  if (states?.length > 0) scopes.push({ method: ['inState', states] })

  return Edition.scope(scopes).findAll({
    include: [
      {
        model: UserProfile,
        where: { id: scientistId },
        through: { attributes: [] },
        attributes: [],
        required: true
      }
    ]
  })
}

export async function addSeedToScientist (scientist, seedId) {
  return await scientist.addSeed(seedId)
}

export async function getScientistsOfEdition (editionId) {
  const whereClause = editionId
    ? { id: editionId }
    : {}

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

export async function getScientistSeedsOfEdition (scientistId, editionId, { role, userId }) {
  role ??= await getUserRole(userId)
  if (role === ROLES.SCIENTIST) {
    role = ROLES.STAFF.name
  } else {
    role = role.name
  }
  return await Seed.scope(role).findAll({
    attributes: ['id', 'title'],
    include: [
      {
        model: UserProfile,
        where: { id: scientistId },
        attributes: [],
        required: true
      },
      {
        model: Edition.unscoped(),
        where: { id: editionId },
        attributes: [],
        required: true
      }
    ]
  })
}

export async function isScientistOfSeed (scientistId, seedId) {
  const record = await SeedScientists.findOne({
    where: { seedId, userProfileId: scientistId }
  })
  return checkExists(record)
}
