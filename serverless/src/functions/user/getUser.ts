import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { customerDto } from "../../dtos/CustomerDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/db";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getUser = async (event) => {
  try {
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
  } catch (error) {
    return errorResponse({
      event,
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};

export const handler = middy
  .default(getUser)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
