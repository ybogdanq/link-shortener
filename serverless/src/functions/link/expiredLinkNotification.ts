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
import { getUserService } from "../../services/user";

const { AWS_ACCOUNT_ID, SES_REGION } = process.env;

export const handler = async (event, context) => {
  const sqs = new SQSClient();
  console.log(event);
  for (let record of event.Records) {
    const receiptHandle = record.receiptHandle;
    const queueName: string = "LinkShortnerNotificationQueue";

    const queueUrl: string = `https://sqs.${SES_REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/${queueName}`;

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
    const user = await getUserService(userId);

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
