import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { customerDto } from "../../dtos/CustomerDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getUser = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;

  const userFromDbRes = await dynamodb.send(
    new GetCommand({ TableName: "CustomerTable", Key: { id: userId } })
  );

  if (!userFromDbRes.Item) {
    throw ApiError.BadRequest("Updated user info couldn't be found...");
  }

  const currentUserState = customerDto(userFromDbRes.Item as IUser);

  return successResponse({
    event,
    statusCode: 200,
    body: { ...currentUserState },
  });
};

export const handler = middy
  .default(getUser)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
