import { HackathonState } from './HackathonState.js'

export class FinishedState extends HackathonState {
  canAdvance () {
    return false
  }

  advance () {
    this.hackathon.state = 'FINISHED'
    return new FinishedState(this.hackathon)
  }

  getNextState () {
    return 'FINISHED'
  }
}
