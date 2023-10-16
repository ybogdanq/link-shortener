import { Link } from "../../types/Link";
import { APIGatewayProxyHandler } from "aws-lambda";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { dynamodb } from "../../utils/clients/db";
import { DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { verifyEmailIdentity } from "../../utils/verifyEmailIdentity";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  await verifyEmailIdentity();
  const sqs = new SQSClient();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const linksToDelete = await dynamodb.send(
    new ScanCommand({
      TableName: "LinkTable",
      FilterExpression: "expiredAt < :currentTimestamp",
      ExpressionAttributeValues: {
        ":currentTimestamp": currentTimestamp,
      },
    })
  );

  const deletePromises = !linksToDelete.Items
    ? []
    : linksToDelete.Items.map((item) => {
        const link = item as Link;
        return dynamodb.send(
          new DeleteCommand({
            TableName: "LinkTable",
            Key: {
              id: link.id,
            },
            ReturnValues: "ALL_OLD",
          })
        );
      });

  const notificationPromises = !linksToDelete.Items
    ? []
    : linksToDelete.Items.map((item) => {
        const link = item as Link;

        const region = context.invokedFunctionArn.split(":")[3];
        const accountId = context.invokedFunctionArn.split(":")[4];
        const queueName: string = "LinkShortnerNotificationQueue";

        const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

        return sqs.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
              userId: link.userId,
              linkId: link.id,
            }),
          })
        );
      });

  await Promise.all(notificationPromises);
  await Promise.all(deletePromises);

  return successResponse({
    event,
    statusCode: 200,
    body: { deletedCount: linksToDelete.Count },
  });
};
