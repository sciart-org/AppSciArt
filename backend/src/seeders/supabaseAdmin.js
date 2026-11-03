import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function seedUser (email, password, userData) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userData
  })
  return { data, error }
}

export async function deleteSeededUser (userId) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  return { error }
}
