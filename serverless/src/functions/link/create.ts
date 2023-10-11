import { DynamoDB } from "aws-sdk";
import { Link } from "../../types/Link";
import { v4 } from "uuid";
import { CreateLinkDto } from "../../dtos/CreateLinkDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

export const handler = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Create link auth User ==> ", userId);
    const dynamodb = new DynamoDB.DocumentClient();
    const body = JSON.parse(event.body);
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
      statusCode: 200,
      body: { ...newLink },
    });
  } catch (error) {
    return errorResponse({
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
