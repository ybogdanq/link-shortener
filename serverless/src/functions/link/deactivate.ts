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

    const res = await dynamodb
      .update({
        TableName: "LinkTable",
        Key: {
          id: linkData.id,
        },
        UpdateExpression: "set active = :newActive",
        ExpressionAttributeValues: {
          ":newActive": false,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_URL || "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(res.Attributes || linkData),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
