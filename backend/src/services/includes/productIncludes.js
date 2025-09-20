import { Edition } from '../../models/Edition.js'
import { Seed } from '../../models/Seed.js'
import { UserProfile } from '../../models/UserProfile.js'
import { InspiringScientist } from '../../models/roles/InspiringScientist.js'
import { Participation } from '../../models/Participation.js'

export const filterPublished = {
  state: 'PUBLISHED'
}

export const includeEdition = (editionId) => {
  return {
    model: Edition,
    where: { id: editionId },
    attributes: []
  }
}

export const includeSeedsOfEdition = (editionId) => {
  return {
    model: Seed,
    required: true,
    include: includeEdition(editionId),
    attributes: ['id', 'title']
  }
}

const includeAuthor = () => {
  return {
    model: UserProfile,
    attributes: ['name', 'surname']
  }
}

export const includeSeedAuthors = {
  model: InspiringScientist,
  attributes: ['id'],
  through: { attributes: [] },
  include: [includeAuthor()]
}

export const includeFlowerAuthors = {
  model: Participation,
  attributes: ['id'],
  include: [includeAuthor()]
}

export const includeFruitAuthors = {
  model: Participation,
  attributes: ['id'],
  include: [includeAuthor()]
}
