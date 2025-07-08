import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { InspiringScientist } from '../models/roles/InspiringScientist.js'
import { UserProfile } from '../models/UserProfile.js'

const includeAuthors = {
  model: InspiringScientist,
  attributes: ['id'],
  through: { attributes: [] },
  include: [
    {
      model: UserProfile,
      attributes: ['name', 'surname']
    }
  ]
}

export async function getSeedsByEdition (editionId) {
  const rawResponse = await Seed.findAll({
    include: [
      {
        model: Edition,
        where: { id: editionId },
        attributes: [],
        through: { attributes: [] }
      },
      includeAuthors
    ]
  })
  const response = rawResponse.map(s => {
    const seed = s.toJSON()
    return {
      ...seed,
      authors: seed.inspiring_scientists.map(is => is.user_profile),
      inspiring_scientists: undefined
    }
  })
  return response
}

export function createSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for createSeed'
  })
}

export function getSeedDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getSeedDetails'
  })
}

export function updateSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for updateSeed'
  })
}

export function deleteSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteSeed'
  })
}

export function publishSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for publishSeed'
  })
}
