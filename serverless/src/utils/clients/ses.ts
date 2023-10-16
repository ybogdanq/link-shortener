import { SES } from "@aws-sdk/client-ses";

const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, FROM_EMAIL } =
  process.env;

export const ses = new SES({
  region: SES_REGION || "",
  credentials: {
    accessKeyId: SES_ACCESS_KEY_ID || "",
    secretAccessKey: SES_SECRET_ACCESS_KEY || "",
  },
});
