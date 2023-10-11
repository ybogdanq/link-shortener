import { SES } from "aws-sdk";
import { createTransport } from "nodemailer";

const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, FROM_EMAIL } =
  process.env;
console.log(
  "env ====> ",
  SES_REGION,
  SES_ACCESS_KEY_ID,
  SES_SECRET_ACCESS_KEY,
  FROM_EMAIL
);

const ses = new SES({
  region: SES_REGION,
  accessKeyId: SES_ACCESS_KEY_ID,
  secretAccessKey: SES_SECRET_ACCESS_KEY,
});

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
