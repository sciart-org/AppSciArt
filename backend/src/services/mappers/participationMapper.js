export const mapGroupMember = (participation) => {
  const member = participation.toJSON()
  return { ...member.user_profile, isGroupVoice: member.isGroupVoice, groupId: member.groupId }
}

export const mapTeamMember = (participation) => {
  const member = participation.toJSON()
  return { ...member.user_profile, isTeamSpeaker: member.isTeamSpeaker, teamId: member.teamId, fruitId: member.fruitId }
}
