import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import envs from '~/constants/env-variables'

type SendEmailDTO = {
  sender: Mail.Address
  receipients: Mail.Address[]
  subject: string
  message: string
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: envs.mailAuthUser,
    pass: envs.mailAuthPass
  }
})

export const sendEmail = (dto: SendEmailDTO) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const { message, receipients, sender, subject } = dto
      await transporter.sendMail(
        {
          from: sender,
          to: receipients,
          subject,
          html: message
        },
        (error, info) => {
          if (error) return reject(error)
          resolve(info.response)
        }
      )
    })()
  })
}
