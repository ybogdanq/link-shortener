import { DynamoDB } from "aws-sdk";
import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { CustomerDto } from "../../dtos/CustomerDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

export const handler = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("'Get user' auth User ==> ", userId);
    const dynamodb = new DynamoDB.DocumentClient();

    const userFromDbRes = await dynamodb
      .get({
        TableName: "CustomerTable",
        Key: { id: userId },
      })
      .promise();

    if (!userFromDbRes.Item) {
      throw ApiError.BadRequest("Updated user info couldn't be found...");
    }

    const currentUserState = CustomerDto(userFromDbRes.Item as IUser);

    return successResponse({
      event,
      statusCode: 200,
      body: { ...currentUserState },
    });
  } catch (error) {
    return errorResponse({
      event,
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
