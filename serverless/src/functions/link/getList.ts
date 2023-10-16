import { DynamoDB } from "aws-sdk";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

export const getLinksList = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Get list of links auth User ==> ", userId);
    const dynamodb = new DynamoDB.DocumentClient();

    const allUserLinks = await dynamodb
      .scan({
        TableName: "LinkTable",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

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
