import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/db";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const visitLink = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      throw ApiError.BadRequest("Bad id provided");
    }

    const linkQueryRes = await dynamodb.send(
      new GetCommand({ TableName: "LinkTable", Key: { id } })
    );

    if (!linkQueryRes.Item) {
      throw ApiError.BadRequest("Bad link id provided");
    }

    const linkData = linkQueryRes.Item as Link;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (!linkData.active || linkData.expiredAt < currentTimestamp) {
      throw ApiError.BadRequest("Link is not active anymore");
    }

    const deactivateCondition =
      linkData.type === "SINGLE" || linkData.expiredAt < currentTimestamp;
    let conditionalParams;

    if (deactivateCondition) {
      conditionalParams = {
        UpdateExpression: "set active = :newActive",
        ExpressionAttributeValues: { ":newActive": false },
      };
    } else {
      conditionalParams = {
        UpdateExpression: "set visits = :incrementedVisits",
        ExpressionAttributeValues: {
          ":incrementedVisits": linkData.visits + 1,
        },
      };
    }
    await dynamodb.send(
      new UpdateCommand({
        TableName: "LinkTable",
        Key: {
          id: linkData.id,
        },
        ...conditionalParams,
        ReturnValues: "ALL_NEW",
      })
    );

    const httpRegex = /^(http|https):\/\//;

    return successResponse({
      event,
      statusCode: 302,
      headers: {
        Location: httpRegex.test(linkData.redirectLink)
          ? linkData.redirectLink
          : "http://" + linkData.redirectLink,
      },
      body: { message: "Redirecting to a new URL" },
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
  .default(visitLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
