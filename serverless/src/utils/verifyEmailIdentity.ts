import { VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ses } from "./clients/ses";

export const verifyEmailIdentity = async () => {
  const command = new VerifyEmailIdentityCommand({
    EmailAddress: process.env.FROM_EMAIL || "",
  });
  await ses.send(command);
};
