import { query } from '../support/db.js'

const firstRow = async (sql, params) => (await query(sql, params)).rows[0]

const countOf = async (sql, params) => (await firstRow(sql, params)).count

export const participationOf = (user, hackathon) => firstRow(
  'SELECT * FROM public.participations WHERE "userProfileId" = $1 AND "hackathonId" = $2',
  [user.id, hackathon.id])

export const isScientistOf = async (user, edition) => await countOf(
  'SELECT count(*)::int AS count FROM public.scientist_editions WHERE "userProfileId" = $1 AND "editionId" = $2',
  [user.id, edition.id]) === 1

export const isAuthorOf = async (user, seed) => await countOf(
  'SELECT count(*)::int AS count FROM public.seed_scientists WHERE "userProfileId" = $1 AND "seedId" = $2',
  [user.id, seed.id]) === 1

export const isEvaluatorOf = async (user, hackathon) => await countOf(
  'SELECT count(*)::int AS count FROM profiles.evaluators WHERE "userProfileId" = $1 AND "hackathonId" = $2',
  [user.id, hackathon.id]) === 1

export const seedIdsOf = async (hackathon) => (await query(
  'SELECT "seedId" FROM public.hackathon_seeds WHERE "hackathonId" = $1', [hackathon.id])).rows.map(row => row.seedId)

export const editionCount = () => countOf('SELECT count(*)::int AS count FROM public.editions')

export const userProfileCount = () => countOf('SELECT count(*)::int AS count FROM profiles.user_profiles')

export const isFacilitator = async (user) => await countOf(
  'SELECT count(*)::int AS count FROM profiles.facilitators WHERE "userProfileId" = $1', [user.id]) === 1

export const makeFacilitator = (user) => query(
  'INSERT INTO profiles.facilitators (id, "userProfileId") VALUES (gen_random_uuid(), $1)', [user.id])

export const removeFacilitatorRole = (user) => query(
  'DELETE FROM profiles.facilitators WHERE "userProfileId" = $1', [user.id])

export const createUnregisteredProfile = (email) => query(
  'INSERT INTO profiles.user_profiles (id, email) VALUES (gen_random_uuid(), $1)', [email])

export const fruitChainOf = (fruit) => firstRow(
  `SELECT fr.state AS "fruitState", fl.state AS "flowerState", h.state AS "hackathonState", se."editionId"
   FROM public.fruits fr
   JOIN public.flowers fl ON fl.id = fr."flowerId"
   JOIN public.seed_editions se ON se."seedId" = fl."seedId"
   JOIN public.participations p ON p."fruitId" = fr.id
   JOIN public.hackathons h ON h.id = p."hackathonId"
   WHERE fr.id = $1
   LIMIT 1`,
  [fruit.id])
