import { toPlainObject } from './utils.js'

export const mapToEditionDetails = (rawEdition) => {
  const edition = toPlainObject(rawEdition)
  return {
    ...edition,
    fruits: edition?.seeds?.flatMap(
      seed => seed.flowers?.flatMap(
        flower => flower.fruits)),
    seeds: undefined
  }
}
