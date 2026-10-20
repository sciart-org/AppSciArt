import { randomUUID } from 'crypto'
import { markFakeLoadedByApp } from '../native.js'
import { outbox } from './outbox.js'

markFakeLoadedByApp('resend')

const successfulSendLikeRealSdk = () => ({ data: { id: randomUUID() }, error: null })

export class Resend {
  constructor () {
    this.emails = {
      send: async (email) => {
        outbox.push({ ...email, to: [].concat(email.to) })
        return successfulSendLikeRealSdk()
      }
    }
  }
}
