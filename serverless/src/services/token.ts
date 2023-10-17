import * as jwt from "jsonwebtoken";
import { IUser } from "../types/User";
import { IToken } from "../types/Token";
import { AuthResponse } from "../types/AuthorizationRes";
import { customerDto } from "../dtos/CustomerDto";
import { dynamodb } from "../utils/clients/db";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../types/DBenums";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const generateTokens = (userPayload: ReturnType<typeof customerDto>) => {
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
  const tokenRes = await dynamodb.send(
    new GetCommand({ TableName: DBTables.TokenTable, Key: { userId: userId } })
  );

  if (tokenRes.Item) {
    await dynamodb.send(
      new UpdateCommand({
        TableName: DBTables.TokenTable,
        Key: { userId: userId },
        UpdateExpression: "set refreshToken = :newRefreshToken",
        ExpressionAttributeValues: {
          ":newRefreshToken": refreshToken,
        },
      })
    );
  } else {
    await dynamodb.send(
      new PutCommand({
        TableName: DBTables.TokenTable,
        Item: {
          userId: userId,
          refreshToken: refreshToken,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }
};

export const removeToken = async (userId: string) => {
  const tokenData = await dynamodb.send(
    new DeleteCommand({ TableName: "TokenTable", Key: { userId } })
  );
  return tokenData;
};

export const findToken = async (
  refreshToken: string
): Promise<IToken | null> => {
  const tokenRes = await dynamodb.send(
    new ScanCommand({
      TableName: DBTables.TokenTable,
      IndexName: "RefreshTokenIndex",
      FilterExpression: "refreshToken = :refreshToken",
      ExpressionAttributeValues: {
        ":refreshToken": refreshToken,
      },
    })
  );
  const tokenData = tokenRes.Items ? (tokenRes.Items[0] as IToken) : null;
  return tokenData;
};

export const serializeUserInfoAndJWT = async (
  userInfo: IUser
): Promise<AuthResponse> => {
  const userDto = customerDto(userInfo);
  const tokens = generateTokens(userDto);
  await saveToken(userInfo.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};
