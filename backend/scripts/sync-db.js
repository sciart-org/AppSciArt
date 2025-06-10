import 'dotenv/config'
import { sequelize } from '../src/config/sequelize.js'
import '../src/models/relations.js'

const enableRLSForTables = async () => {
  const tables = [
    'editions',
    'seeds',
    'flowers',
    'fruits',
    'hackathons',
    'seed_editions',
    'hackathon_seeds',
    'participations',
    'user_profile',
    'seed_likes'
  ]

  for (const table of tables) {
    await sequelize.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`)
    console.log(`RLS enabled on public.${table}`)
  }
}

const createAuthTrigger = async () => {
  const functionSQL = `
    create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = ''
    as $$
    begin
      insert into public.user_profile (id)
      values (new.id);
      return new;
    end;
    $$;
  `

  const triggerSQL = `
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  `

  await sequelize.query(functionSQL)
  await sequelize.query(triggerSQL)

  console.log('✅ Trigger and function for auth.users → public.user_profiles set up.')
}

const run = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established.')

    await sequelize.sync({ alter: true })
    console.log('✅ All models synced.')

    await enableRLSForTables()
    await createAuthTrigger()

    console.log('✅ RLS enabled and auth trigger configured.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error syncing database:', error)
    process.exit(1)
  }
}

run()
