import { registerCustomerDto } from "../../dtos/RegisterCustomerDto";
import { v4 } from "uuid";
import { hash } from "bcryptjs";
import { customerDto } from "../../dtos/CustomerDto";
import ApiError from "../../exceptions/apiError";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import {
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";

console.log(process.env.JWT_ACCESS_SECRET);

export const register = async (event) => {
  const body = event.body;

  const { user } = registerCustomerDto(body);

  const { email, password } = user;
  const hashPassword = await hash(password, 10);

  const existingUser = await dynamodb.send(
    new QueryCommand({
      TableName: DBTables.CustomerTable,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
  );

  if (existingUser.Items && existingUser.Items.length > 0) {
    throw ApiError.Conflict("User already exists");
  }

  const newUser = {
    ...user,
    id: v4(),
    password: hashPassword,
  };

  await dynamodb.send(
    new PutCommand({
      TableName: "CustomerTable",
      Item: newUser,
      ConditionExpression: "attribute_not_exists(email)",
    })
  );

  return successResponse({
    event,
    statusCode: 201,
    body: { user: customerDto(newUser) },
  });
};

export const handler = middy
  .default(register)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
