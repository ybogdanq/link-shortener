import { DynamoDB } from "aws-sdk";
import { verifyUser } from "../../utils/verifyUser";
import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { CustomerDto } from "../../dtos/CustomerDto";

export const handler = async (event) => {
  try {
    const user = verifyUser(event);
    const dynamodb = new DynamoDB.DocumentClient();

    const userFromDbRes = await dynamodb
      .query({
        TableName: "CustomerTable",
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": user.email,
        },
      })
      .promise();

    if (!userFromDbRes.Items || userFromDbRes.Items.length === 0) {
      throw ApiError.BadRequest("Updated user info couldn't be found...");
    }

    const currentUserState = CustomerDto(userFromDbRes.Items[0] as IUser);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_URL || "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...currentUserState }),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
