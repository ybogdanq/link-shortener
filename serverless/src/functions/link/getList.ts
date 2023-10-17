import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../../types/DBenums";

export const getLinksList = async (event) => {
  const { principalId: userId } = event.requestContext?.authorizer;

  const allUserLinks = await dynamodb.send(
    new ScanCommand({
      TableName: DBTables.LinkTable,
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
};

export const handler = middy
  .default(getLinksList)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
