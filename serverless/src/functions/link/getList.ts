import { DynamoDB } from "aws-sdk";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

export const handler = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Get list of links auth User ==> ", userId);
    const dynamodb = new DynamoDB.DocumentClient();

    const allUserLinks = await dynamodb
      .scan({
        TableName: "LinkTable",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return successResponse({
      event,
      statusCode: 200,
      body: allUserLinks.Items || [],
    });
  } catch (error) {
    return errorResponse({
      event,
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
