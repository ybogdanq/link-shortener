import { DynamoDB } from "aws-sdk";
import { verifyUser } from "../../utils/verifyUser";
import { Link } from "../../types/Link";

export const handler = async (event) => {
  try {
    const dynamodb = new DynamoDB.DocumentClient();
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
