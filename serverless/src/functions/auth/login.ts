import { DynamoDB } from "aws-sdk";
import { LoginCustomerDto } from "../../dtos/LoginCustomer";
import { compareSync } from "bcryptjs";
import { IUser } from "../../types/User";
import { serializeUserInfoAndJWT } from "../../services/token";
import { successResponse } from "../../utils/responses/successResponse";
import { errorResponse } from "../../utils/responses/errorResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

const login = async (event) => {
  const body = event.body;
  const dynamodb = new DynamoDB.DocumentClient();
  const { email, password } = LoginCustomerDto(body);

  const userRes = await dynamodb
    .query({
      TableName: "CustomerTable",
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
    .promise();

  const user = userRes.Items ? (userRes.Items[0] as IUser) : null;

  if (!user) {
    throw new Error("User or password is incorrect, please try again");
  }

  const passwordsEqual = compareSync(password, user.password);
  if (!passwordsEqual)
    throw new Error("User or password is incorrect, please try again");

  const userDataAndJWT = await serializeUserInfoAndJWT(user);

  // Create a cookie string
  const cookieName = "refreshToken";
  const cookieValue = userDataAndJWT.refreshToken;
  const maxAge = 30 * 24 * 60 * 60;
  const cookieFinal = `${cookieName}=${cookieValue}; HttpOnly; Max-Age=${maxAge};`;

  return successResponse({
    event,
    statusCode: 200,
    headers: {
      "Set-Cookie": cookieFinal,
    },
    body: {
      ...userDataAndJWT,
    },
  });
};

export const handler = middy
  .default(login)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
