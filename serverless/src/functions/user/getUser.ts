import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { customerDto } from "../../dtos/CustomerDto";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { getUserService } from "../../services/user";

export const getUser = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;

  const user = await getUserService(userId);

  return successResponse({
    event,
    statusCode: 200,
    body: { ...user },
  });
};

export const handler = middy
  .default(getUser)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
