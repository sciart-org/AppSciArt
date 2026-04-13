export class HackathonState {
  constructor (hackathon) {
    this.hackathon = hackathon
  }

  canAdvance () {
    return false
  }

  advance () {
    throw new Error('Cannot advance from this state')
  }

  getNextState () {
    return null
  }

  getNextPhase () {
    return null
  }
}
