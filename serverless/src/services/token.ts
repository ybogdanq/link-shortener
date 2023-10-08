import * as jwt from "jsonwebtoken";
import { IUser } from "../types/User";
import { DynamoDB } from "aws-sdk";
import { IToken } from "../types/Token";
import { AuthResponse } from "../types/AuthorizationRes";
import { CustomerDto } from "../dtos/CustomerDto";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

const dynamodb = new DynamoDB.DocumentClient();

export const generateTokens = (userPayload: ReturnType<typeof CustomerDto>) => {
  const accessToken = jwt.sign(userPayload, `${JWT_ACCESS_SECRET}`.toString(), {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign(
    userPayload,
    `${JWT_REFRESH_SECRET}`.toString(),
    {
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const validateAccesstoken = <T>(token: string) => {
  try {
    const userData = jwt.verify(token, JWT_ACCESS_SECRET || "") as T;
    return userData;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = <T>(token: string) => {
  try {
    const userData = jwt.verify(token, JWT_REFRESH_SECRET || "") as T;
    return userData;
  } catch (error) {
    return null;
  }
};

export const saveToken = async (userId: string, refreshToken: string) => {
  const tokenRes = await dynamodb
    .get({
      TableName: "TokenTable",
      Key: { userId: userId },
    })
    .promise();

  if (tokenRes.Item) {
    await dynamodb
      .update({
        TableName: "TokenTable",
        Key: { userId: userId },
        UpdateExpression: "set refreshToken = :newRefreshToken",
        ExpressionAttributeValues: {
          ":newRefreshToken": refreshToken,
        },
      })
      .promise();
  } else {
    await dynamodb
      .put({
        TableName: "TokenTable",
        Item: {
          userId: userId,
          refreshToken: refreshToken,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
      .promise();
  }
};

export const removeToken = async (userId: string) => {
  const tokenData = await dynamodb
    .delete({
      TableName: "TokenTable",
      Key: { userId },
    })
    .promise();
  return tokenData;
};

export const findToken = async (
  refreshToken: string
): Promise<IToken | null> => {
  const tokenRes = await dynamodb
    .scan({
      TableName: "TokenTable",
      IndexName: "RefreshTokenIndex",
      FilterExpression: "refreshToken = :refreshToken",
      ExpressionAttributeValues: {
        ":refreshToken": refreshToken,
      },
    })
    .promise();
  const tokenData = tokenRes.Items ? (tokenRes.Items[0] as IToken) : null;
  return tokenData;
};

export const serializeUserInfoAndJWT = async (
  userInfo: IUser
): Promise<AuthResponse> => {
  const userDto = CustomerDto(userInfo);
  const tokens = generateTokens(userDto);
  await saveToken(userInfo.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};
