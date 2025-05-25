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
