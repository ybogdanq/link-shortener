import { loginCustomerDto } from "../../dtos/LoginCustomer";
import { compareSync } from "bcryptjs";
import { IUser } from "../../types/User";
import { serializeUserInfoAndJWT } from "../../services/token";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import ApiError from "../../exceptions/apiError";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const login = async (event) => {
  const body = event.body;
  const { email, password } = loginCustomerDto(body);

  const userRes = await dynamodb.send(
    new QueryCommand({
      TableName: "CustomerTable",
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
  );

  const user = userRes.Items ? (userRes.Items[0] as IUser) : null;

  if (!user) {
    throw ApiError.BadRequest(
      "User or password is incorrect, please try again"
    );
  }

  const passwordsEqual = compareSync(password, user.password);
  if (!passwordsEqual)
    throw ApiError.BadRequest(
      "User or password is incorrect, please try again"
    );

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
