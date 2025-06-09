import * as service from '../services/authService.js'

export function login (req, res) {
  service.login(req, res)
}

export function register (req, res) {
  service.register(req, res)
}

export function registerProvider (req, res) {
  service.registerProvider(req, res)
}
