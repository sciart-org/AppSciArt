import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_KEY
const EMAIL_REDIRECT_TO = process.env.NODE_ENV !== 'production' ? process.env.EMAIL_REDIRECT_TO : undefined
let resend
if (RESEND_KEY) {
  resend = new Resend(RESEND_KEY)
}

export const sendEmail = async ({ recipient, subject, html }) => {
  if (!RESEND_KEY) {
    return {
      data: null,
      error: {
        status: 500,
        message: 'Emails temporarily disabled'
      }
    }
  }
  const { data, error } = await resend.emails.send({
    from: 'AppSciArt <info@appsciart.ovh>',
    to: [EMAIL_REDIRECT_TO || recipient],
    subject,
    html
  })
  return { data, error: { status: error.statusCode, message: error.message } }
}
