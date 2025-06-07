import { supabase } from './supabase.js'

export async function signInEmail (email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function getUserFromJwt (jwt) {
  const { data, error } = await supabase.auth.getUser(jwt)
  return { data, error }
}
