import { stateSharedWithApp } from '../native.js'

const delivery = stateSharedWithApp('emailDelivery', () => ({ failuresLeft: 0 }))

export const failEmailDelivery = ({ times = Infinity } = {}) => { delivery.failuresLeft = times }

export const restoreEmailDelivery = () => { delivery.failuresLeft = 0 }

export const nextDeliveryFails = () => {
  if (delivery.failuresLeft <= 0) return false
  delivery.failuresLeft--
  return true
}
