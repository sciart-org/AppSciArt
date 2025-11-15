import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_KEY
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
    to: [recipient],
    subject,
    html
  })
  return { data, error: { status: error.statusCode, message: error.message } }
}
