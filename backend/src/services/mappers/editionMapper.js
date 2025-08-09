import { toPlainObject } from './utils.js'

export const mapToEditionSummary = (rawEdition) => {
  const edition = toPlainObject(rawEdition)
  return {
    id: edition.id,
    name: edition.name,
    logo: edition.logo,
    year: edition.year,
    shortDescription: edition.shortDescription,
    state: edition.state
  }
}

export const mapToEditionDetails = (rawEdition) => {
  const edition = toPlainObject(rawEdition)
  return {
    id: edition.id,
    name: edition.name,
    logo: edition.logo,
    year: edition.year,
    longDescription: edition.longDescription,
    catalogLink: edition.catalogLink,
    fruits: edition.seeds?.flatMap(
      seed => seed.flowers?.flatMap(
        flower => flower.fruits)),
    state: edition.state
  }
}
