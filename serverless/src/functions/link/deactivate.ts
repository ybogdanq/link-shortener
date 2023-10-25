import ApiError from "../../exceptions/apiError";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { Handler } from "aws-lambda";
import { deactivateLinkService, getLinkService } from "../../services/link";

export const deactivateLink: Handler = async (event, context) => {
  const userId = event.requestContext?.authorizer?.principalId || event.userId;
  const linkId = event.pathParameters?.id || event.linkId;
  if (!linkId || !userId) {
    throw ApiError.BadRequest("Bad link id provided or user doesn't exist");
  }

  console.log({ userId, linkId });
  console.log("before linkData");

  const linkData = await getLinkService({ userId, linkId: linkId });

  console.log("before deactivatedLink");
  const deactivatedLink = await deactivateLinkService(linkData.id);

  return successResponse({
    event,
    statusCode: 200,
    body: deactivatedLink || linkData,
  });
};

export const handler = deactivateLink;
