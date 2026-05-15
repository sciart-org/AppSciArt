import 'dotenv/config'
import { google } from 'googleapis'
import { AppConfig } from '../models/AppConfig.js'

const loadDriveAuthConfig = async () => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  const GOOGLE_REFRESH_TOKEN = await AppConfig.findByPk('GOOGLE_REFRESH_TOKEN').then(
    (config) => config?.value
  )

  auth.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
  })

  return google.drive({
    version: 'v3',
    auth
  })
}

export { loadDriveAuthConfig }
