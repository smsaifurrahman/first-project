import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
    console.log(to);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'smsaifur525@gmail.com',
      pass: 'rhiv psxd pyyd hctz',
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: 'smsaifur525@gmail.com', // sender address
    to: to, // list of receivers
    subject: 'Reset your password within 10 mins', // Subject line
    text: 'Reset your password with 10 mins', // plain text body
    html, // html body
  });
};
