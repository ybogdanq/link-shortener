import { SES, SendEmailCommand } from "@aws-sdk/client-ses";
import { createTransport } from "nodemailer";
import { ses } from "./clients/ses";

const { FROM_EMAIL } = process.env;
const MAIL_PASS_KEY = "vxquffdytmjbnisx";
const MAIL_USER = "ybogdanq.mail@gmail.com";
const SMTP_HOST = "smtp.gmail.com";

//"Throttling: Daily message quota exceeded." So I'm using nodemailer instead

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

// export const sendMail = async (to: string[], subject: string, text: string) => {
//   return await ses.send(
//     new SendEmailCommand({
//       Source: FROM_EMAIL,
//       Destination: {
//         ToAddresses: to,
//       },
//       Message: {
//         Subject: {
//           Charset: "UTF-8",
//           Data: "Link deactivated",
//         },
//         Body: {
//           Text: {
//             Charset: "UTF-8",
//             Data: text,
//           },
//         },
//       },
//     })
//   );
// };

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
