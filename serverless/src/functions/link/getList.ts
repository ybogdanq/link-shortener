import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const getLinksList = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Get list of links auth User ==> ", userId);

    const allUserLinks = await dynamodb.send(
      new ScanCommand({
        TableName: "LinkTable",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    return successResponse({
      event,
      statusCode: 200,
      body: allUserLinks.Items || [],
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
  .default(getLinksList)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
