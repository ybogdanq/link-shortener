import { DynamoDB } from "aws-sdk";
import { Link } from "../../types/Link";
import { v4 } from "uuid";
import { CreateLinkDto } from "../../dtos/CreateLinkDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

export const createLink = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Create link auth User ==> ", userId);
    const dynamodb = new DynamoDB.DocumentClient();
    const body = event.body;
    const { redirectLink, numberOfDays, type } = CreateLinkDto(body);

    const currentTime = new Date().getTime();
    const expirationTimestamp =
      Math.floor(currentTime / 1000) + numberOfDays * 24 * 60 * 60;

    const newLink: Link = {
      id: v4().split("").splice(0, 6).join(""),
      userId: userId,
      type: type,
      active: true,
      redirectLink: redirectLink,
      visits: 0,
      expiredAt: expirationTimestamp,
    };

    await dynamodb
      .put({
        TableName: "LinkTable",
        Item: newLink,
      })
      .promise();

    return successResponse({
      event,
      statusCode: 200,
      body: { ...newLink },
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
  .default(createLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
