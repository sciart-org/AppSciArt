import { mapToFlowerPublicDetail, mapToFruitPublicDetail } from './productMapper.js'
import { toPlainObject } from './utils.js'

export const mapHackathonParticipation = (rawParticipation) => {
  const participation = toPlainObject(rawParticipation)

  return {
    id: participation?.id,
    clusterNumber: participation?.clusterNumber,
    conceptualMap: { ...participation?.conceptual_map, seed: undefined, map: undefined },
    groupSeed: participation?.conceptual_map?.seed,
    teamFlower: { ...mapToFlowerPublicDetail(participation?.flower), seed: undefined },
    teamFruit: { ...mapToFruitPublicDetail(participation?.fruit), flower: undefined, seed: undefined },
    groupMembers: participation?.groupMembers,
    teamMembers: participation?.teamMembers,
    hackathonId: participation?.hackathonId,
    interests: participation?.interests,
    roles: participation?.roles,
    isGroupVoice: participation?.isGroupVoice,
    isTeamSpeaker: participation?.isTeamSpeaker
  }
}
