import { query } from '../db.js'
import { participant } from '../users.js'
import { insertTimestampedRow, uniqueSuffix } from './rows.js'
import { createFruitFolders } from './driveTemplates.js'
import { anAnnouncedEdition } from './editions.js'
import { anEndedHackathon, aSeedOf, enrol } from './hackathons.js'
import { aPublishedSeed } from './seeds.js'
import { aTeam } from './groupsAndTeams.js'
import { ensureHackathonHasFruits, ensureSameEdition } from './consistency.js'

const DEFAULT_AUTHOR_NUMBER = 15

const editionOf = async (hackathon) => {
  const { rows: [edition] } = await query('SELECT * FROM public.editions WHERE id = $1', [hackathon.editionId])
  return edition
}

const isEnrolled = async (user, hackathon) => {
  const { rowCount } = await query(
    'SELECT 1 FROM public.participations WHERE "userProfileId" = $1 AND "hackathonId" = $2', [user.id, hackathon.id])
  return rowCount > 0
}

const enrolIfNeeded = async (users, hackathon) => {
  for (const user of users) {
    if (!(await isEnrolled(user, hackathon))) await enrol(user, hackathon)
  }
}

const linkAuthorsToFruit = (authors, hackathon, fruit) => query(
  'UPDATE public.participations SET "fruitId" = $1 WHERE "hackathonId" = $2 AND "userProfileId" = ANY($3)',
  [fruit.id, hackathon.id, authors.map(author => author.id)])

const endedHackathonAndEdition = async ({ edition, hackathon }) => {
  if (hackathon) {
    const hackathonEdition = await editionOf(hackathon)
    if (edition) ensureSameEdition(hackathon, edition)
    return { hackathon, edition: hackathonEdition }
  }
  edition ??= await anAnnouncedEdition()
  return { hackathon: await anEndedHackathon({ edition }), edition }
}

export const aFruit = async ({
  edition,
  hackathon,
  authors = [participant(DEFAULT_AUTHOR_NUMBER)],
  state = 'PUBLISHED',
  title = `Fruit ${uniqueSuffix()}`,
  mainImage = true,
  authorVision = "The authors' vision of the fruit",
  curatorVision = "The curator's vision of the fruit",
  seedDescription = 'The seed and how the fruit relates to it'
} = {}) => {
  ({ hackathon, edition } = await endedHackathonAndEdition({ edition, hackathon }))
  ensureHackathonHasFruits(hackathon)
  const seed = await aSeedOf(hackathon, await aPublishedSeed({ edition }))
  await enrolIfNeeded(authors, hackathon)
  const flower = await aTeam({ hackathon, seed, members: authors, flowerState: 'PUBLISHED' })
  const fruit = await insertTimestampedRow('public.fruits', {
    title,
    state,
    authorVision,
    curatorVision,
    seedDescription,
    flowerId: flower.id,
    driveLink: createFruitFolders({ editionDriveLink: edition.driveLink, title, mainImage })
  })
  await linkAuthorsToFruit(authors, hackathon, fruit)
  return { ...fruit, flower, seed, hackathon }
}
