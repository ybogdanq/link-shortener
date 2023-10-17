import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { sendMail } from "../../utils/sendMail";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import { dynamodb } from "../../utils/clients/db";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";
import { verifyEmailIdentity } from "../../utils/verifyEmailIdentity";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export const handler = async (event, context) => {
  const sqs = new SQSClient();
  console.log(event);
  for (let record of event.Records) {
    const receiptHandle = record.receiptHandle;
    const region = context.invokedFunctionArn.split(":")[3];
    const accountId = context.invokedFunctionArn.split(":")[4];
    const queueName: string = "LinkShortnerNotificationQueue";

    const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

    await sqs.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      })
    );

    const messageBody = JSON.parse(record.body);
    const userId = messageBody.userId;
    const linkId = messageBody.linkId;

    // Fetch user's email address from your database based on userId
    const existingUser = await dynamodb.send(
      new GetCommand({ TableName: DBTables.CustomerTable, Key: { id: userId } })
    );
    if (!existingUser.Item) {
      throw ApiError.BadRequest("User doesn't exist");
    }

    const user = existingUser.Item as IUser;

    await verifyEmailIdentity(process.env.FROM_EMAIL || "");
    await verifyEmailIdentity(user.email);

    const res = await sendMail(
      [user.email],
      "Link deactivation notification",
      `Your link with ID ${linkId} has been deactivated.`
    );

    console.log(res);
  }

  return successResponse({
    event,
    statusCode: 200,
    body: "Email sent successfully",
  });
};
