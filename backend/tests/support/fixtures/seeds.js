import { insertTimestampedRow, linkRows, uniqueSuffix } from './rows.js'
import { createSeedFolders } from './driveTemplates.js'
import { anAnnouncedEdition } from './editions.js'

export const aScientistOf = async (edition, user) => {
  await linkRows('public.scientist_editions', { editionId: edition.id, userProfileId: user.id })
  return user
}

const addAuthor = async (seed, edition, author) => {
  await aScientistOf(edition, author)
  await linkRows('public.seed_scientists', { seedId: seed.id, userProfileId: author.id })
}

export const aSeed = async ({
  edition,
  authors = [],
  state = 'IN_PROGRESS',
  title = `Seed ${uniqueSuffix()}`,
  branchesOfKnowledge = ['Biology'],
  videoLink = null,
  presentationLink = null,
  podcastLink = null
} = {}) => {
  edition ??= await anAnnouncedEdition()
  const seed = await insertTimestampedRow('public.seeds', {
    title,
    state,
    branchesOfKnowledge,
    videoLink,
    presentationLink,
    podcastLink,
    driveLink: await createSeedFolders({ editionDriveLink: edition.driveLink, title })
  })
  await linkRows('public.seed_editions', { seedId: seed.id, editionId: edition.id })
  for (const author of authors) await addAuthor(seed, edition, author)
  return seed
}

export const aPublishedSeed = (overrides) => aSeed({ ...overrides, state: 'PUBLISHED' })
