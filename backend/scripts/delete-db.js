import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { EarlySignup } from '../src/models/EarlySignup.js'
import { Edition } from '../src/models/Edition.js'
import { Flower } from '../src/models/Flower.js'
import { Fruit } from '../src/models/Fruit.js'
import { Hackathon } from '../src/models/Hackathon.js'
import { Participation } from '../src/models/Participation.js'
import { Administrator } from '../src/models/roles/Administrator.js'
import { Designer } from '../src/models/roles/Designer.js'
import { Evaluator } from '../src/models/roles/Evaluator.js'
import { Facilitator } from '../src/models/roles/Facilitator.js'
import { InspiringScientist } from '../src/models/roles/InspiringScientist.js'
import { Seed } from '../src/models/Seed.js'
import { UserProfile } from '../src/models/UserProfile.js'

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ADMIN_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

export const deleteDatabase = async () => {
  await Participation.destroy({ truncate: { cascade: true } })
  await Fruit.destroy({ truncate: { cascade: true } })
  await Flower.destroy({ truncate: { cascade: true } })
  await Seed.destroy({ truncate: { cascade: true } })
  await Hackathon.destroy({ truncate: { cascade: true } })
  await EarlySignup.destroy({ truncate: { cascade: true } })
  await Edition.destroy({ truncate: { cascade: true } })
  await Administrator.destroy({ truncate: { cascade: true } })
  await Designer.destroy({ truncate: { cascade: true } })
  await Evaluator.destroy({ truncate: { cascade: true } })
  await Facilitator.destroy({ truncate: { cascade: true } })
  await InspiringScientist.destroy({ truncate: { cascade: true } })

  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
  for (const u of users) {
    try {
      await supabaseAdmin.auth.admin.deleteUser(u.id)
    } catch (err) {
      console.error(err)
    }
  }

  await UserProfile.destroy({ truncate: { cascade: true } })
}

await deleteDatabase()
