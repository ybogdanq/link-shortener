import ApiError from "../../exceptions/apiError";
import { Link } from "../../types/Link";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/db";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const deactivateLink = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Deactivate link auth User ==> ", userId);
    const { id } = event.pathParameters;
    if (!id) {
      throw ApiError.BadRequest("Bad id provided");
    }

    const linkQueryRes = await dynamodb.send(
      new QueryCommand({
        TableName: "LinkTable",
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

    const res = await dynamodb.send(
      new UpdateCommand({
        TableName: "LinkTable",
        Key: {
          id: linkData.id,
        },
        UpdateExpression: "set active = :newActive",
        ExpressionAttributeValues: {
          ":newActive": false,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return successResponse({
      event,
      statusCode: 200,
      body: res.Attributes || linkData,
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
  .default(deactivateLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
