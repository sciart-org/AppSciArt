import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'
import { checkIsStaff } from './userValidators.js'

const checkUserIsInGroup = async (userId, groupId) => {
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { groupId })
  errorThrower(!checkExists(participation), 'You are not in this group', 403)
  return participation
}

const checkUserIsInTeam = async (userId, teamId) => {
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { teamId })
  errorThrower(!checkExists(participation), 'You are not in this team', 403)
  return participation
}

export const checkUserIsGroupVoice = async (userId, groupId) => {
  const participation = await checkUserIsInGroup(userId, groupId)
  errorThrower(!(participation?.isGroupVoice), 'Only the group voice can submit the conceptual map', 403)
  return participation
}

export const checkUserIsTeamSpeaker = async (userId, teamId) => {
  const participation = await checkUserIsInTeam(userId, teamId)
  errorThrower(!(participation?.isTeamSpeaker), 'Only the team speaker can submit the flower', 403)
  return participation
}

export const checkUserIsInHackathon = async (userId, hackathonId) => {
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  if (checkIsStaff(userId)) return participation
  errorThrower(!checkExists(participation), 'You are not in this hackathon', 403)
  return participation
}
