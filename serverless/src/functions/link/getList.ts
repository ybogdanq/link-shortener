import { DynamoDB } from "aws-sdk";
import { verifyUser } from "../../utils/verifyUser";

export const handler = async (event) => {
  try {
    const user = verifyUser(event);
    const dynamodb = new DynamoDB.DocumentClient();

    const allUserLinks = await dynamodb
      .scan({
        TableName: "LinkTable",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": user.id,
        },
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allUserLinks.Items || []),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
