import { DynamoDB, SES } from "aws-sdk";
import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";

export const handler = async (event) => {
  try {
    const ses = new SES();
    const dynamodb = new DynamoDB.DocumentClient();

    const record = event.Records[0];
    console.log(record, "record");
    const messageBody = JSON.parse(record.body);

    const userId = messageBody.userId;
    const linkId = messageBody.linkId;

    // Fetch user's email address from your database based on userId
    const existingUser = await dynamodb
      .get({
        TableName: "CustomerTable",
        Key: { id: userId },
      })
      .promise();
    if (!existingUser.Item) {
      throw ApiError.BadRequest("User doesn't exist");
    }

    const user = existingUser.Item as IUser;

    console.log(process.env.SES_SENDER_EMAIL, "process.env.SES_SENDER_EMAIL");

    const emailParams = {
      Source: process.env.SES_SENDER_EMAIL as string,
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Subject: {
          Data: "Link Deleted Notification",
        },
        Body: {
          Text: {
            Data: `Your link with ID ${linkId} has been deleted.`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();

    return {
      statusCode: 200,
      body: "Email sent successfully",
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
