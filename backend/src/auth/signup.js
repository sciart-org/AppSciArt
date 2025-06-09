import { supabase } from './supabase.js'

export async function signUpEmail (email, password, userData) {
  const { data, error } = await supabase.auth.signUp(
    {
      email,
      password,
      options: {
        data: userData
      }
    }
  )
  return { data, error }
}

export async function signUpGoogle () {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.FRONTEND_URL + '/auth/callback'
    }
  })

  return { data, error }
}
