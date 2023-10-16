import { Link } from "../../types/Link";
import { APIGatewayProxyHandler } from "aws-lambda";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import { SQS } from "aws-sdk";
import { dynamodb } from "../../utils/db";
import {
  DeleteCommand,
  DeleteCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const sqs = new SQS();
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

          const sqsParams: SQS.SendMessageRequest = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
              userId: link.userId,
              linkId: link.id,
            }),
          };
          console.log(sqsParams, "queueUrl");
          return sqs.sendMessage(sqsParams).promise();
        });

    await Promise.all(notificationPromises);
    await Promise.all(deletePromises);

    return successResponse({
      event,
      statusCode: 200,
      body: { deletedCount: linksToDelete.Count },
    });
  } catch (error) {
    return errorResponse({
      event,
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
