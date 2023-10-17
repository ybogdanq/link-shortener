import { VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import { ses } from "./clients/ses";

export const verifyEmailIdentity = async (email: string) => {
  try {
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: email,
    });
    await ses.send(command);
    return { statusCode: 200 };
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }
};
