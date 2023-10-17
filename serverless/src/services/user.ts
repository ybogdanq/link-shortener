import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../utils/clients/db";
import { DBTables } from "../types/DBenums";
import ApiError from "../exceptions/apiError";
import { IUser } from "../types/User";
import { customerDto } from "../dtos/CustomerDto";

export const getUserService = async (userId: string) => {
  const userFromDbRes = await dynamodb.send(
    new GetCommand({ TableName: DBTables.CustomerTable, Key: { id: userId } })
  );

  if (!userFromDbRes.Item) {
    throw ApiError.BadRequest("Updated user info couldn't be found...");
  }

  return customerDto(userFromDbRes.Item as IUser);
}