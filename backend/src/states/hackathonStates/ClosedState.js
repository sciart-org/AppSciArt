import { checkExists } from '../../validators/generalValidators.js'
import { FinishedState } from './FinishedState.js'
import { HackathonState } from './HackathonState.js'
import * as GroupsAndTeamsService from '../../services/groupsAndTeamsService.js'
import { storeAndDeleteAllGroupsOfHackathon } from '../../sockets/diagramming.js'

const checkSomeGroupWithoutVoice = (hackathon) => {
  const groups = [...new Set(hackathon.participations.map(p => p.groupId).filter(Boolean))]
  const groupWithoutVoice = groups.find(
    (groupId) => !hackathon.participations.some(p => p.groupId === groupId && p.isGroupVoice)
  )
  return !!groupWithoutVoice
}

const checkSomeAssistingWithoutGroup = (hackathon) => {
  return hackathon.participations.some(p => p.hasConfirmedAssistance && !checkExists(p.groupId))
}

const phaseRules = {
  PREPARING: (h) => {
    if (h.type !== 'ON_SITE' && !checkExists(h.meetLink)) {
      return { canAdvance: false, errorMessage: 'Online hackathons must have a meet link before starting.' }
    }
    return { canAdvance: true }
  },
  GROUP_CREATION: (h) => {
    if (checkSomeAssistingWithoutGroup(h)) {
      return { canAdvance: false, errorMessage: 'There are assisting participants without an assigned exploring group.' }
    }
    if (checkSomeGroupWithoutVoice(h)) {
      return { canAdvance: false, errorMessage: 'There are groups without a group voice assigned.' }
    }
    return { canAdvance: true }
  },
  GROUP_WORK: (h) => {
    return { canAdvance: true }
  },
  GROUP_PRESENTATION: (h) => {
    return { canAdvance: true }
  },
  TEAM_CREATION: (h) => {
    return { canAdvance: true }
  },
  TEAM_WORK: (h) => {
    return { canAdvance: true }
  }
}

export class ClosedState extends HackathonState {
  canAdvance () {
    const rule = phaseRules[this.hackathon.phase]
    return rule ? rule(this.hackathon) : { canAdvance: false, errorMessage: 'Unknown phase' }
  }

  async advance () {
    const nextPhase = this.getNextPhase()
    const nextState = this.getNextState()

    this.hackathon.phase = nextPhase
    this.hackathon.state = nextState

    if (nextPhase === 'GROUP_CREATION') {
      await GroupsAndTeamsService.createConceptualMapsOfHackathon(this.hackathon.id)
    } else if (nextPhase === 'GROUP_WORK') {
      await GroupsAndTeamsService.deleteUnassignedConceptualMapsOfHackathon(this.hackathon.id)
    } else if (nextPhase === 'GROUP_PRESENTATION') {
      storeAndDeleteAllGroupsOfHackathon(this.hackathon.id)
      await GroupsAndTeamsService.deliverAllConceptualMapsOfHackathon(this.hackathon.id)
    }

    if (nextState === 'FINISHED') {
      return new FinishedState(this.hackathon)
    }

    return this
  }

  getNextState () {
    if (this.hackathon.phase === 'TEAM_WORK') { return 'FINISHED' }
    return 'CLOSED'
  }

  getNextPhase () {
    switch (this.hackathon.phase) {
      case 'PREPARING':
        return 'GROUP_CREATION'
      case 'GROUP_CREATION':
        return 'GROUP_WORK'
      case 'GROUP_WORK':
        return 'GROUP_PRESENTATION'
      case 'GROUP_PRESENTATION':
        return 'TEAM_CREATION'
      case 'TEAM_CREATION':
        return 'TEAM_WORK'
      case 'TEAM_WORK':
        return 'TEAM_WORK'
      default:
        return this.hackathon.phase
    }
  }
}
