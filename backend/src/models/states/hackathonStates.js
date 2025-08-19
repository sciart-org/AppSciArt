class PlannedState {
  constructor (hackathon) {
    this.hackathon = hackathon
  }

  openRegistration () {
    console.log('Hackathon is now OPEN for registration.')
    this.hackathon.setState(this.hackathon.openState)
  }

  close () {
    console.log("Cannot close — hackathon hasn't opened yet.")
  }

  finish () {
    console.log("Cannot finish — hackathon hasn't started yet.")
  }
}

class OpenState {
  constructor (hackathon) {
    this.hackathon = hackathon
  }

  openRegistration () {
    console.log('Already OPEN for registration.')
  }

  close () {
    console.log('Hackathon is now CLOSED.')
    this.hackathon.setState(this.hackathon.closedState)
  }

  finish () {
    console.log('Cannot finish — hackathon is still open.')
  }
}

class ClosedState {
  constructor (hackathon) {
    this.hackathon = hackathon
  }

  openRegistration () {
    console.log('Cannot reopen — hackathon is CLOSED.')
  }

  close () {
    console.log('Already CLOSED.')
  }

  finish () {
    console.log('Hackathon is now FINISHED.')
    this.hackathon.setState(this.hackathon.finishedState)
  }
}

class FinishedState {
  constructor (hackathon) {
    this.hackathon = hackathon
  }

  openRegistration () {
    console.log('Hackathon already FINISHED — cannot reopen.')
  }

  close () {
    console.log('Hackathon already FINISHED.')
  }

  finish () {
    console.log('Already FINISHED.')
  }
}

export { PlannedState, OpenState, ClosedState, FinishedState }
