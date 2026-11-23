import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import { sendEmail } from './resend.js'

const FRONTEND_URL = process.env.FRONTEND_URL

const logUndelivered = ({ subject }, reason) =>
  console.error(`Email not delivered ("${subject}"): ${reason}`)

const deliver = async (email) => {
  try {
    const { error } = await sendEmail(email)
    if (error) logUndelivered(email, error.message)
  } catch (error) {
    logUndelivered(email, error.message)
  }
}

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
  return deliver({
    recipient: email,
    subject: 'Welcome to AppSciArt!',
    html
  })
}

export const sendScientistPreRegistrationEmail = (email, preRegistrationId, editionName) => {
  const completeRegistrationUrl = FRONTEND_URL + '/signup/complete/' + preRegistrationId
  const html = readEmail('scientist-pre-registration', { completeRegistrationUrl, editionName })
  return deliver({
    recipient: email,
    subject: 'Welcome to AppSciArt!',
    html
  })
}

export const sendCompleteRegistrationEmail = (email, name) => {
  const homeUrl = FRONTEND_URL
  const html = readEmail('completed-registration', { homeUrl, name })
  return deliver({
    recipient: email,
    subject: "You're All Set!",
    html
  })
}
