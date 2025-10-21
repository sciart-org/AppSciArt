import { Participation } from '../models/Participation.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'

const checkUserIsInGroup = async (userId, groupId) => {
  const participation = await Participation.findOne({
    where: {
      userProfileId: userId,
      groupId
    }
  })
  errorThrower(!checkExists(participation), 'You are not in this group', 403)
  return participation
}

export const checkUserIsGroupVoice = async (userId, groupId) => {
  const participation = await checkUserIsInGroup(userId, groupId)
  errorThrower(!(participation?.isGroupVoice), 'Only the group voice can submit the conceptual map', 403)
  return participation.id
}

export const checkUserIsInHackathon = async (userId, hackathonId) => {
  const participation = await Participation.findOne({
    attributes: ['id'],
    where: {
      userProfileId: userId,
      hackathonId
    }
  })
  errorThrower(!checkExists(participation), 'You are not in this hackathon', 403)
  return participation.id
}
