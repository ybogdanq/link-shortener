import ApiError from "../../exceptions/apiError";
import {
  findToken,
  serializeUserInfoAndJWT,
  validateRefreshToken,
} from "../../services/token";
import { IUser } from "../../types/User";
import { parseCookies } from "../../utils/parseCookies";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";

export const refreshToken = async (event, ...rest) => {
  const { refreshToken } = parseCookies(event);

  const user = validateRefreshToken<IUser>(refreshToken);
  const tokenFromDb = await findToken(refreshToken);

  if (!user || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }

  //Getting current user's state in case if user updated during the session
  const userFromDbRes = await dynamodb.send(
    new QueryCommand({
      TableName: DBTables.CustomerTable,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": user.email,
      },
    })
  );
  if (!userFromDbRes.Items || userFromDbRes.Items.length === 0) {
    throw ApiError.BadRequest("Updated user info couldn't be found...");
  }

  const currentUserState = userFromDbRes.Items[0] as IUser;

  const userDataAndJWT = await serializeUserInfoAndJWT(currentUserState);

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
    body: userDataAndJWT,
  });
};

export const handler = middy
  .default(refreshToken)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
