import { mapToFlowerPublicDetail } from './productMapper.js'
import { toPlainObject } from './utils.js'

export const mapHackathonParticipation = (rawParticipation) => {
  const participation = toPlainObject(rawParticipation)

  return {
    id: participation?.id,
    clusterNumber: participation?.clusterNumber,
    seed: participation?.flower?.seed,
    flower: mapToFlowerPublicDetail({ ...participation?.flower, seed: undefined }),
    fruit: { ...participation?.fruit, flower: undefined },
    groupMembers: participation?.groupMembers,
    teamMembers: participation?.teamMembers,
    hackathonId: participation?.hackathonId,
    interests: participation?.interests,
    roles: participation?.roles
  }
}
