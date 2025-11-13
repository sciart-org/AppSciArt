import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import { sendEmail } from './resend.js'
import { errorThrower } from '../services/errorThrower.js'

const FRONTEND_URL = process.env.FRONTEND_URL

const readEmail = (templateName, data) => {
  const contentPath = path.join(process.cwd(), 'src/emails/templates', `${templateName}.ejs`)
  const basePath = path.join(process.cwd(), 'src/emails/templates', 'base.ejs')

  const contentTemplate = fs.readFileSync(contentPath, 'utf-8')

  const renderedContent = ejs.render(contentTemplate, data, {
    filename: contentPath
  })

  const baseTemplate = fs.readFileSync(basePath, 'utf-8')
  return ejs.render(baseTemplate, { ...data, content: renderedContent }, {
    filename: basePath
  })
}

export const sendQuickRegisterEmail = (email, preRegistrationId) => {
  const completeRegistrationUrl = FRONTEND_URL + '/signup/complete/' + preRegistrationId
  const html = readEmail('quick-register', { completeRegistrationUrl })
  const { data, error } = sendEmail({
    recipient: email,
    subject: 'Welcome to AppSciArt!',
    html
  })
  errorThrower(error?.status, error?.message, error?.status)
}
