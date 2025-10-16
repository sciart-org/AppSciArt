import { ConceptualMap } from '../../models/ConceptualMap.js'
import { Flower } from '../../models/Flower.js'
import { Fruit } from '../../models/Fruit.js'
import { Seed } from '../../models/Seed.js'
import { UserProfile } from '../../models/UserProfile.js'

export const includeParticipationItems = () => {
  return [
    {
      model: Fruit
    },
    {
      model: Flower,
      attributes: {
        exclude: ['title', 'mainImage', 'concept', 'conceptualMap', 'state', 'seedId', 'createdAt', 'updatedAt']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge', 'createdAt', 'updatedAt']
        }
      }
    },
    {
      model: ConceptualMap,
      attributes: {
        exclude: ['seedId', 'createdAt', 'updatedAt']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge', 'createdAt', 'updatedAt']
        }
      }
    }
  ]
}

export const searchParticipantsOf = ({ hackathonId, clusterNumber, groupId = undefined, teamId = undefined, flowerId = undefined }) => {
  return {
    where: {
      hackathonId,
      clusterNumber,
      ...(groupId !== undefined && { groupId }),
      ...(teamId !== undefined && { teamId }),
      ...(flowerId !== undefined && { flowerId })
    },
    attributes: ['id', 'isGroupVoice', 'isTeamSpeaker', 'groupId', 'teamId', 'fruitId'],
    include: [{
      model: UserProfile,
      attributes: ['id', 'name', 'surname']
    }]
  }
}
