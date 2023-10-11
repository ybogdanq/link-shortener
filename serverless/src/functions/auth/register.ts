import { DynamoDB } from "aws-sdk";
import { RegisterCustomerDto } from "../../dtos/RegisterCustomerDto";
import { v4 } from "uuid";
import { hash } from "bcryptjs";
import { CustomerDto } from "../../dtos/CustomerDto";
import ApiError from "../../exceptions/apiError";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

console.log(process.env.JWT_ACCESS_SECRET);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const dynamodb = new DynamoDB.DocumentClient();

    const { user } = RegisterCustomerDto(body);

    const { email, password } = user;
    const hashPassword = await hash(password, 10);

    const existingUser = await dynamodb
      .query({
        TableName: "CustomerTable",
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();

    if (existingUser.Items && existingUser.Items.length > 0) {
      throw ApiError.Conflict("User already exists");
    }

    const newUser = {
      ...user,
      id: v4(),
      password: hashPassword,
    };

    await dynamodb
      .put({
        TableName: "CustomerTable",
        Item: newUser,
        ConditionExpression: "attribute_not_exists(email)",
      })
      .promise();

    return successResponse({
      statusCode: 201,
      body: { user: CustomerDto(newUser) },
    });
  } catch (error) {
    return errorResponse({
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
