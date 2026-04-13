export const mapGroupMember = (participation) => {
  const member = participation.toJSON()
  return {
    ...member.userProfile,
    isGroupVoice: member.isGroupVoice,
    groupId: member.groupId
  }
}

export const mapTeamMember = (participation) => {
  const member = participation.toJSON()
  return {
    ...member.userProfile,
    isTeamSpeaker: member.isTeamSpeaker,
    teamId: member.teamId,
    fruitId: member.fruitId
  }
}
