import { getUserFromJwt } from '../auth/signin.js'

export function getUsers (req, res) {
  res.send({
    message: 'This is the mockup controller for getUsers'
  })
}

export function createUser (req, res) {
  res.send({
    message: 'This is the mockup controller for createUser'
  })
}

export function getUserInfo (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserInfo'
  })
}

export function editUser (req, res) {
  res.send({
    message: 'This is the mockup controller for editUser'
  })
}

export async function getCurrentUser (req, res) {
  const jwt = req.headers.authorization.split(' ')[1]
  const { data, error } = await getUserFromJwt(jwt)
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(200).send({
      jwt,
      name: data.user.user_metadata.name,
      surname: data.user.user_metadata.surname
    })
  }
}
