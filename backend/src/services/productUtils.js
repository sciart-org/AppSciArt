import { Participation } from '../models/Participation.js'
import { InspiringScientist } from '../models/roles/InspiringScientist.js'
import { UserProfile } from '../models/UserProfile.js'

export const includeSeedAuthors = {
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

export const includeFlowerAuthors = {
  model: Participation,
  attributes: ['id'],
  include: [
    {
      model: UserProfile,
      attributes: ['name', 'surname']
    }
  ]
}

export const includeFruitAuthors = {
  model: Participation,
  attributes: ['id'],
  include: [
    {
      model: UserProfile,
      attributes: ['name', 'surname']
    }
  ]
}

export const mapToSeedSummary = (rawSeed) => {
  const seed = rawSeed.toJSON()
  return {
    id: seed.id,
    title: seed.title,
    mainImage: seed.mainImage,
    authors: seed.inspiring_scientists.map(is => is.user_profile),
    branchesOfKnowledge: seed.branchesOfKnowledge
  }
}

export const mapToFlowerSummary = (rawFlower) => {
  const flower = rawFlower.toJSON()
  return {
    id: flower.id,
    title: flower.title,
    mainImage: flower.mainImage,
    authors: flower.participations.map(is => is.user_profile),
    seed: {
      id: flower.seedId,
      title: flower.seed.title
    }
  }
}

export const mapToFlowerPublicDetail = (rawFlower) => {
  const flower = rawFlower.toJSON()
  return {
    id: flower.id,
    title: flower.title,
    mainImage: flower.mainImage,
    concept: flower.concept,
    authors: flower.participations.map(is => is.user_profile),
    seed: {
      id: flower.seed.id,
      title: flower.seed.title,
      authors: flower.seed.inspiring_scientists.map(is => is.user_profile)
    }
  }
}

export const mapToFruitSummary = (rawFruit) => {
  const fruit = rawFruit.toJSON()
  return {
    id: fruit.id,
    title: fruit.title,
    mainImage: fruit.mainImage,
    authors: fruit.participations.map(is => is.user_profile),
    seed: {
      id: fruit.flower.seed.id,
      title: fruit.flower.seed.title
    }
  }
}

export const mapToFruitPublicDetail = (rawFruit) => {
  const fruit = rawFruit.toJSON()
  return {
    id: fruit.id,
    title: fruit.title,
    mainImage: fruit.mainImage,
    authors: fruit.participations.map(is => is.user_profile),
    authorVision: fruit.authorVision,
    curatorVision: fruit.curatorVision,
    flower: {
      id: fruit.flowerId,
      title: fruit.flower.title
    },
    seed: {
      id: fruit.flower.seed.id,
      title: fruit.flower.seed.title,
      authors: fruit.flower.seed.inspiring_scientists.map(is => is.user_profile),
      description: fruit.seedDescription
    }
  }
}
