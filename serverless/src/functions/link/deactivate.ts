import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";
import { Handler } from "aws-lambda";
import { deactivateLinkService } from "../../services/link";

export const deactivateLink: Handler = async (event, context) => {
  const { principalId: userId } = event.requestContext?.authorizer;

  const { id } = event.pathParameters;
  if (!id) {
    throw ApiError.BadRequest("Bad id provided");
  }

  const linkQueryRes = await dynamodb.send(
    new QueryCommand({
      TableName: DBTables.LinkTable,
      IndexName: "UserIdIndex",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":id": id,
      },
    })
  );

  if (!linkQueryRes.Items || linkQueryRes.Items.length === 0) {
    throw ApiError.BadRequest("Bad link id provided");
  }
  const linkData = linkQueryRes.Items[0] as Link;

  console.log(context);

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
