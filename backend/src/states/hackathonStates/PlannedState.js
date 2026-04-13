import { HackathonState } from './HackathonState.js'
import { OpenState } from './OpenState.js'

export class PlannedState extends HackathonState {
  canAdvance () {
    return true
  }

  advance () {
    this.hackathon.state = 'OPEN'
    return new OpenState(this.hackathon)
  }

  getNextState () {
    return 'OPEN'
  }

  getNextPhase () {
    return 'PREPARING'
  }
}
