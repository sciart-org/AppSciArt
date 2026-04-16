import { checkExists } from '../../validators/generalValidators.js'
import { FinishedState } from './FinishedState.js'
import { HackathonState } from './HackathonState.js'

const phaseRules = {
  PREPARING: (h) => {
    if (h.type !== 'ON_SITE' && !checkExists(h.meetLink)) {
      return { canAdvance: false, errorMessage: 'Online hackathons must have a meet link before starting.' }
    }
    return { canAdvance: true }
  },
  GROUP_CREATION: (h) => {
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

  advance () {
    const nextPhase = this.getNextPhase()
    const nextState = this.getNextState()

    this.hackathon.phase = nextPhase
    this.hackathon.state = nextState

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
