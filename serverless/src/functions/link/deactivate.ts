import ApiError from "../../exceptions/apiError";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { Handler } from "aws-lambda";
import { deactivateLinkService, getLinkService } from "../../services/link";

export const deactivateLink: Handler = async (event, context) => {
  const { principalId: userId } = event.requestContext?.authorizer;

  const { id } = event.pathParameters;
  if (!id) {
    throw ApiError.BadRequest("Bad id provided");
  }

  const linkData = await getLinkService({ userId, linkId: id });

  const deactivatedLink = await deactivateLinkService(linkData.id);

  return successResponse({
    event,
    statusCode: 200,
    body: deactivatedLink || linkData,
  });
};

export const handler = middy
  .default(deactivateLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
