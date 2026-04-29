import nodemailer from "nodemailer";
import { emailPassword } from "../../config";
import { MailOptions } from "nodemailer/lib/json-transport";



export const sendEmail = async (
{  to,
  subject,
  html,}:MailOptions
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // important for port 587
    auth: {
      user: "osamamn897@gmail.com",
      pass: emailPassword as string,
    },
  });

  await transporter.sendMail({
    from: "<osamamn897@gmail.com>",
    to,
    subject,
    html,
  });
};