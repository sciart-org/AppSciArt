import { toPlainObject } from './utils.js'

export const mapToSeedSummary = (rawSeed) => {
  const seed = toPlainObject(rawSeed)
  return {
    id: seed?.id,
    title: seed?.title,
    mainImage: seed?.mainImage,
    authors: seed?.inspiring_scientists.map(is => is.user_profile),
    branchesOfKnowledge: seed?.branchesOfKnowledge,
    state: seed?.state
  }
}

export const mapToFlowerSummary = (rawFlower) => {
  const flower = toPlainObject(rawFlower)
  return {
    id: flower?.id,
    title: flower?.title,
    mainImage: flower?.mainImage,
    authors: flower?.participations.map(is => is.user_profile),
    seed: {
      id: flower?.seedId,
      title: flower?.seed?.title
    },
    state: flower?.state
  }
}

export const mapToFlowerPublicDetail = (rawFlower) => {
  const flower = toPlainObject(rawFlower)
  return {
    id: flower?.id,
    title: flower?.title,
    mainImage: flower?.mainImage,
    concept: flower?.concept,
    authors: flower?.participations?.map(is => is.user_profile),
    seed: {
      id: flower?.seed?.id,
      title: flower?.seed?.title,
      authors: flower?.seed?.inspiring_scientists.map(is => is.user_profile)
    },
    state: flower?.state
  }
}

export const mapToFruitSummary = (rawFruit) => {
  const fruit = toPlainObject(rawFruit)
  return {
    id: fruit?.id,
    title: fruit?.title,
    mainImage: fruit?.mainImage,
    authors: fruit?.participations.map(is => is.user_profile),
    seed: {
      id: fruit?.flower?.seed?.id,
      title: fruit?.flower?.seed?.title
    },
    state: fruit?.state
  }
}

export const mapToFruitPublicDetail = (rawFruit) => {
  const fruit = toPlainObject(rawFruit)
  return {
    id: fruit?.id,
    title: fruit?.title,
    mainImage: fruit?.mainImage,
    authors: fruit?.participations.map(is => is.user_profile),
    authorVision: fruit?.authorVision,
    curatorVision: fruit?.curatorVision,
    flower: {
      id: fruit?.flowerId,
      title: fruit?.flower?.title
    },
    seed: {
      id: fruit?.flower?.seed?.id,
      title: fruit?.flower?.seed?.title,
      authors: fruit?.flower?.seed?.inspiring_scientists.map(is => is.user_profile),
      description: fruit?.seedDescription
    },
    state: fruit?.state
  }
}
