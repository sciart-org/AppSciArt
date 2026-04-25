import { errorThrower } from '../services/errorThrower.js'
import { ClosedState } from './hackathonStates/ClosedState.js'
import { FinishedState } from './hackathonStates/FinishedState.js'
import { OpenState } from './hackathonStates/OpenState.js'
import { PlannedState } from './hackathonStates/PlannedState.js'

export class HackathonStates {
  static getState (hackathon) {
    switch (hackathon.state) {
      case 'PLANNED':
        return new PlannedState(hackathon)
      case 'OPEN':
        return new OpenState(hackathon)
      case 'CLOSED':
        return new ClosedState(hackathon)
      case 'FINISHED':
        return new FinishedState(hackathon)
      default:
        throw new Error(`Unknown phase: ${hackathon.phase}`)
    }
  }

  static canAdvance (hackathon) {
    const state = this.getState(hackathon)
    return state.canAdvance()
  }

  static async advancePhase (hackathon) {
    const state = this.getState(hackathon)

    const { canAdvance, errorMessage } = state.canAdvance()

    errorThrower(!canAdvance, errorMessage, 400)

    const newState = await state.advance()
    await hackathon.save()

    return newState
  }

  static getNextState (hackathon) {
    const state = this.getState(hackathon)
    return state.getNextState()
  }

  static getNextPhase (hackathon) {
    const state = this.getState(hackathon)
    return state.getNextPhase()
  }
}
