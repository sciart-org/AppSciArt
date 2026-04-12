import { mapFruitAuthors } from './productMapper.js'
import { toPlainObject } from './utils.js'

export const mapHackathonParticipation = (rawParticipation) => {
  const participation = toPlainObject(rawParticipation)

  return {
    ...participation,
    conceptual_map: undefined,
    conceptualMap: { ...participation?.conceptual_map, seed: undefined, map: undefined },
    groupId: undefined,
    groupSeed: participation?.conceptual_map?.seed,
    flower: undefined,
    teamId: undefined,
    teamFlower: { ...participation?.flower, seed: participation?.flower?.seed },
    fruit: undefined,
    fruitId: undefined,
    teamFruit: { ...mapFruitAuthors(participation?.fruit), flower: undefined, seed: undefined }
  }
}
