import { toPlainObject } from './utils.js'

export const mapFlowerAuthors = (rawFlower) => {
  const flower = toPlainObject(rawFlower)
  return {
    ...flower,
    authors: flower?.participations?.map(is => is.user_profile),
    participations: undefined,
    seed: flower?.seed
  }
}

export const mapFruitAuthors = (rawFruit) => {
  const fruit = toPlainObject(rawFruit)
  return {
    ...fruit,
    authors: fruit?.participations?.map(is => is.user_profile),
    participations: undefined,
    seed: {
      ...fruit?.flower?.seed,
      description: fruit?.seedDescription
    },
    flower: {
      ...fruit?.flower,
      seed: undefined
    },
    seedDescription: undefined
  }
}
