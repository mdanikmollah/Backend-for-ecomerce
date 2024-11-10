import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mdanik0178@gmail.com',
    pass: 'fuqe egny xlkj cpmj',
  },
})

export const forgotEmail = async (options) => {
  const info = await transporter.sendMail({
    from: ' <noreply@technest.com>',
    to: options.email,
    subject: 'Reset Passwrod for Tech Nest Account',
    text: '',
    html: options.html,
  })
}