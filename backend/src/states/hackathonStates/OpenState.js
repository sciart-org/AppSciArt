import { ClosedState } from './ClosedState.js'
import { HackathonState } from './HackathonState.js'

export class OpenState extends HackathonState {
  canAdvance () {
    return true
  }

  advance () {
    this.hackathon.state = 'CLOSED'
    return new ClosedState(this.hackathon)
  }

  getNextState () {
    return 'CLOSED'
  }

  getNextPhase () {
    return 'PREPARING'
  }
}
