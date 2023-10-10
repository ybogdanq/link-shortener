import { DynamoDB } from "aws-sdk";
import ApiError from "../../exceptions/apiError";
import {
  findToken,
  serializeUserInfoAndJWT,
  validateRefreshToken,
} from "../../services/token";
import { IUser } from "../../types/User";
import { parseCookies } from "../../utils/parseCookies";

export const handler = async (event, ...rest) => {
  try {
    console.log({ event, ...rest });
    const dynamodb = new DynamoDB.DocumentClient();

    const { refreshToken } = parseCookies(event);

    const user = validateRefreshToken<IUser>(refreshToken);
    const tokenFromDb = await findToken(refreshToken);

    if (!user || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    //Getting current user's state in case if user updated during the session
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

    const currentUserState = userFromDbRes.Items[0] as IUser;

    const userDataAndJWT = await serializeUserInfoAndJWT(currentUserState);

    // Create a cookie string
    const cookieName = "refreshToken";
    const cookieValue = userDataAndJWT.refreshToken;
    const maxAge = 30 * 24 * 60 * 60;
    const cookieFinal = `${cookieName}=${cookieValue}; HttpOnly; Max-Age=${maxAge};`;

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": cookieFinal,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataAndJWT),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
