import 'dotenv/config'
import { google } from 'googleapis'

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

auth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

export const drive = google.drive({
  version: 'v3',
  auth
})
