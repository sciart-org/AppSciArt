import dotenvFlow from 'dotenv-flow'

const LOCAL_HOSTS = ['127.0.0.1', 'localhost']

const refuseToRunOutsideTestingEnv = () => {
  if (process.env.NODE_ENV !== 'testing') {
    throw new Error(`Acceptance tests need NODE_ENV=testing (got "${process.env.NODE_ENV}"). Use "npm test".`)
  }
}

const refuseToRunAgainstNonLocalStack = () => {
  for (const url of [process.env.DATABASE_URL, process.env.SUPABASE_URL]) {
    const { hostname } = new URL(url)
    if (!LOCAL_HOSTS.includes(hostname)) {
      throw new Error(`Acceptance tests only run against the local testing stack, not "${hostname}".`)
    }
  }
}

const replaceThirdPartyCredentialsWithFakes = () => {
  process.env.RESEND_KEY = 're_fake_test_key'
  process.env.DRIVE_FOLDER_ID = 'fakeRootFolderId0000000000000'
  process.env.GOOGLE_CLIENT_ID = 'fake-client-id'
  process.env.GOOGLE_CLIENT_SECRET = 'fake-client-secret'
  process.env.GOOGLE_REDIRECT_URI = 'http://127.0.0.1/oauth2callback'
  delete process.env.EMAIL_REDIRECT_TO
}

export const loadLocalTestingEnvironment = () => {
  refuseToRunOutsideTestingEnv()
  dotenvFlow.config()
  refuseToRunAgainstNonLocalStack()
  replaceThirdPartyCredentialsWithFakes()
}
