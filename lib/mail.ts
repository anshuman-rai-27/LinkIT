import nodemailer from "nodemailer"
import { SENDER_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "./constant"

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
})


export async function sendMail(toEmail: string, subject: string, text: string) {
    await transporter.sendMail({
        from: SENDER_EMAIL,
        to: toEmail,
        subject: subject,
        text: text,
        html: `<p>${text}<p>`
    })
}