import { signInEmail } from '../auth/signin.js'
import { signUpEmail } from '../auth/signup.js'

export async function login (req, res) {
  const { email, password } = req.body
  const { data, error } = await signInEmail(email, password)
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(201).send({
      jwt: data.session.access_token,
      name: data.user.user_metadata.name,
      surname: data.user.user_metadata.surname
    })
  }
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
      jwt: data.session.access_token,
      name: data.user.user_metadata.name,
      surname: data.user.user_metadata.surname
    })
  }
}
