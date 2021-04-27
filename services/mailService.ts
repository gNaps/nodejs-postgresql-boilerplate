import nodemailer, { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
});

export const sendMail = (from: string, to: string, subject: string, text: string, html: string, cc: string) => {
    const options: MailOptions = {
        from,
        to,
        subject,
        text,
        html,
        cc
    };

    
  
    return transporter.sendMail(options);
}