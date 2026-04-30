import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import * as ProductsRepository from '../repositories/productsRepository.js'

const checkUserIsInGroup = async (userId, groupId) => {
  const participation = await ProductsRepository.getMinimalParticipationOfUserInHackathon(userId, { groupId })
  errorThrower(!checkExists(participation), 'You are not in this group', 403)
  return participation
}

export const checkUserIsGroupVoice = async (userId, groupId) => {
  const participation = await checkUserIsInGroup(userId, groupId)
  errorThrower(!(participation?.isGroupVoice), 'Only the group voice can submit the conceptual map', 403)
  return participation
}

export const checkUserIsInHackathon = async (userId, hackathonId) => {
  const participation = await ProductsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  errorThrower(!checkExists(participation), 'You are not in this hackathon', 403)
  return participation
}
