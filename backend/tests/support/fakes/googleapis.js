import { driveApi } from './driveStore.js'
import { markFakeLoadedByApp } from '../native.js'

markFakeLoadedByApp('googleapis')

class NoOpOAuth2 {
  setCredentials () {}
  on () {}
  generateAuthUrl () { return 'https://accounts.google.com/o/oauth2/fake' }
  async getToken () { return { tokens: {} } }
}

export const google = {
  auth: { OAuth2: NoOpOAuth2 },
  drive: () => driveApi
}

export default { google }
