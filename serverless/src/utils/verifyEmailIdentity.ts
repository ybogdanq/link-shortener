import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";

export const verifyEmailIdentity = async () => {
  const client = new SESClient();
  const input = {
    EmailAddress: process.env.FROM_EMAIL || "",
  };
  const command = new VerifyEmailIdentityCommand(input);
  await client.send(command);
};
