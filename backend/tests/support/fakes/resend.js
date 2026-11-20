import { randomUUID } from 'crypto'
import { markFakeLoadedByApp } from '../native.js'
import { countAsAppWork } from '../appWork.js'
import { outbox, undelivered } from './outbox.js'
import { nextDeliveryFails } from './emailDelivery.js'

markFakeLoadedByApp('resend')

const successfulSendLikeRealSdk = () => ({ data: { id: randomUUID() }, error: null })

const outageLikeRealSdk = () => ({
  data: null,
  error: {
    name: 'application_error',
    statusCode: 500,
    message: 'Internal server error. We are unable to process your request right now, please try again later.'
  }
})

const deliver = (email) => {
  const addressed = { ...email, to: [].concat(email.to) }
  if (nextDeliveryFails()) {
    undelivered.push(addressed)
    return outageLikeRealSdk()
  }
  outbox.push(addressed)
  return successfulSendLikeRealSdk()
}

export class Resend {
  constructor () {
    this.emails = {
      send: (email) => countAsAppWork(async () => deliver(email))
    }
  }
}
