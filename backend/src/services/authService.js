import { signUpEmail } from '../auth/signup.js'

export function login (req, res) {
  res.send({
    message: 'This is the mockup controller for login'
  })
}

export async function register (req, res) {
  const { method } = req.query
  if (method === 'complete') {
    await completeRegister(req, res)
  } else if (method === 'quick') {
    res.status(500).send({
      message: 'Quick registration not yet implemented'
    })
  } else {
    res.status(500).send({
      message: 'Invalid registration method'
    })
  }
}

const completeRegister = async (req, res) => {
  const { email, password, name, surname, gender, birthDate } = req.body
  const userData = {
    name, surname, gender, birthDate
  }
  const { data, error } = await signUpEmail(email, password, userData)
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(201).send({
      jwt: data.session.access_token
    })
  }
}
