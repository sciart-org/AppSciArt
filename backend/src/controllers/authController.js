import * as service from '../services/authService.js'

export function login (req, res) {
  service.login(req, res)
}

export function register (req, res) {
  const { method } = req.query
  if (method === 'direct') {
    service.directRegister(req, res)
  } else if (method === 'quick') {
    service.quickRegister(req, res)
  } else {
    res.status(500).send({
      message: 'Invalid method'
    })
  }
}

export function registerProvider (req, res) {
  const { provider } = req.query
  if (provider === 'google') {
    service.googleRegister(req, res)
  } else {
    res.status(500).send({
      message: 'Invalid provider'
    })
  }
}

export function completeRegistration (req, res) {
  service.completeRegistration(req, res)
}
