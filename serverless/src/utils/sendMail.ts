import { SES } from "@aws-sdk/client-ses";
import { createTransport } from "nodemailer";
import { ses } from "./clients/ses";

const { FROM_EMAIL } = process.env;
const MAIL_PASS_KEY = "vxquffdytmjbnisx";
const MAIL_USER = "ybogdanq.mail@gmail.com";
const SMTP_HOST = "smtp.gmail.com";

// const transporter = createTransport({
//   SES: ses,
// });

const transporter = createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (
  to: string | string[],
  subject: string,
  text: string
) => {
  return await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
  });
};
