import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_KEY
const resend = new Resend(RESEND_KEY)

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
    from: 'AppSciArt <onboarding@resend.dev>',
    to: [recipient],
    subject,
    html
  })
  return { data, error }
}
