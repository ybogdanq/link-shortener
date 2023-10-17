import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";
import { getLinkService } from "../../services/link";

export const deleteLink = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;
  const { id } = event.pathParameters;

  if (!id) {
    throw ApiError.BadRequest("Bad id provided");
  }

  const linkData = await getLinkService({ userId, linkId: id });

  const deleted = await dynamodb.send(
    new DeleteCommand({
      TableName: DBTables.LinkTable,
      Key: {
        id: linkData.id,
      },
      ReturnValues: "ALL_OLD",
    })
  );

  return successResponse({
    event,
    statusCode: 200,
    body: deleted.Attributes,
  });
};

export const handler = middy
  .default(deleteLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
