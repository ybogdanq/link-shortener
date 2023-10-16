import { SES } from "@aws-sdk/client-ses";
import { createTransport } from "nodemailer";
import { ses } from "./clients/ses";

const { FROM_EMAIL } = process.env;

const transporter = createTransport({
  SES: ses,
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
