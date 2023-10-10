import { DynamoDB } from "aws-sdk";
import { verifyUser } from "../../utils/verifyUser";
import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";

export const handler = async (event) => {
  try {
    const user = verifyUser(event);
    const dynamodb = new DynamoDB.DocumentClient();
    const { id } = event.pathParameters;

    if (!id) {
      throw ApiError.BadRequest("Bad id provided");
    }

    const linkQueryRes = await dynamodb
      .query({
        TableName: "LinkTable",
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
          ":userId": user.id,
          ":id": id,
        },
      })
      .promise();

    if (!linkQueryRes.Items || linkQueryRes.Items.length === 0) {
      throw ApiError.BadRequest("Bad link id provided");
    }
    const linkData = linkQueryRes.Items[0] as Link;

    const deleted = await dynamodb
      .delete({
        TableName: "LinkTable",
        Key: {
          id: linkData.id,
        },
        ReturnValues: "ALL_OLD",
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
      body: JSON.stringify(deleted),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
