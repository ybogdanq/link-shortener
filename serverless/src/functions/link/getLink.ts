import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";
import { getLinkService } from "../../services/link";

export const getLink = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;
  const { id } = event.pathParameters;

  if (!id) {
    throw ApiError.BadRequest("Bad id provided");
  }

  const linkData = await getLinkService({userId, linkId: id})

  return successResponse({
    event,
    statusCode: 200,
    body: { ...linkData },
  });
};

export const handler = middy
  .default(getLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
