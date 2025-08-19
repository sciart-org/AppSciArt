import { ClosedState, FinishedState, OpenState, PlannedState } from './hackathonStates.js'

export class HackathonState {
  constructor (hackathonRecord) {
    this.record = hackathonRecord

    this.plannedState = new PlannedState(this)
    this.openState = new OpenState(this)
    this.closedState = new ClosedState(this)
    this.finishedState = new FinishedState(this)

    this.setStateFromRecord()
  }

  setStateFromRecord () {
    switch (this.record.state) {
      case 'PLANNED':
        this.state = this.plannedState
        break
      case 'OPEN':
        this.state = this.openState
        break
      case 'CLOSED':
        this.state = this.closedState
        break
      case 'FINISHED':
        this.state = this.finishedState
        break
    }
  }

  setState (newState) {
    this.state = newState
    this.record.state = this.getStateName()
    return this.record.save()
  }

  getStateName () {
    if (this.state === this.plannedState) return 'PLANNED'
    if (this.state === this.openState) return 'OPEN'
    if (this.state === this.closedState) return 'CLOSED'
    if (this.state === this.finishedState) return 'FINISHED'
  }

  openRegistration () {
    this.state.openRegistration()
  }

  close () {
    this.state.close()
  }

  finish () {
    this.state.finish()
  }

  nextPhase () {
    if (this.record.state !== 'CLOSED') {
      throw new Error('Phases can only advance when hackathon is in CLOSED state')
    }

    const phaseOrder = [
      'PREPARING',
      'GROUP_CREATION',
      'GROUP_WORK',
      'GROUP_PRESENTATION',
      'TEAM_CREATION',
      'TEAM_WORK'
    ]

    const currentIndex = phaseOrder.indexOf(this.record.phase)

    if (currentIndex === -1) {
      throw new Error(`Unknown phase: ${this.record.phase}`)
    }

    if (currentIndex < phaseOrder.length - 1) {
      this.record.phase = phaseOrder[currentIndex + 1]
    }

    return this.record.save()
  }
}
