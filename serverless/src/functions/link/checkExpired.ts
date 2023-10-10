import { DynamoDB, SQS } from "aws-sdk";
import { Link } from "../../types/Link";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const dynamodb = new DynamoDB.DocumentClient();
    const sqs = new SQS();
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const linksToDelete = await dynamodb
      .scan({
        TableName: "LinkTable",
        FilterExpression: "expiredAt < :currentTimestamp",
        ExpressionAttributeValues: {
          ":currentTimestamp": currentTimestamp,
        },
      })
      .promise();

    const deletePromises = !linksToDelete.Items
      ? []
      : linksToDelete.Items.map((item) => {
          const link = item as Link;
          return dynamodb
            .delete({
              TableName: "LinkTable",
              Key: {
                id: link.id,
              },
              ReturnValues: "ALL_OLD",
            })
            .promise();
        });

    const notificationPromises = !linksToDelete.Items
      ? []
      : linksToDelete.Items.map((item) => {
          const link = item as Link;

          const region = context.invokedFunctionArn.split(":")[3];
          const accountId = context.invokedFunctionArn.split(":")[4];
          const queueName: string = "LinkShortnerNotificationQueue";

          const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

          console.log(queueUrl, "queueUrl");

          const sqsParams: SQS.SendMessageRequest = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
              userId: link.userId,
              linkId: link.id,
            }),
          };
          return sqs.sendMessage(sqsParams).promise();
        });

    await Promise.all(notificationPromises);
    await Promise.all(deletePromises);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deletedCount: linksToDelete.Count }),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
