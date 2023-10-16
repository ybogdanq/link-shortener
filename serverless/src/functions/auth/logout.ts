import * as middy from "@middy/core";
import { removeToken } from "../../services/token";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

const logout = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;
  console.log("Deactivate link auth User ==> ", userId);

  await removeToken(userId);

  return successResponse({
    event,
    statusCode: 200,
    headers: {
      "Set-Cookie":
        "refreshToken=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
    body: {},
  });
};

export const handler = middy
  .default(logout)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
