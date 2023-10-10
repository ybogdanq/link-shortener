import { DynamoDB } from "aws-sdk";
import { verifyUser } from "../../utils/verifyUser";
import { Link } from "../../types/Link";
import { v4 } from "uuid";
import { CreateLinkDto } from "../../dtos/CreateLinkDto";

export const handler = async (event) => {
  try {
    const user = verifyUser(event);
    const dynamodb = new DynamoDB.DocumentClient();
    const body = JSON.parse(event.body);
    const { redirectLink, numberOfDays, type } = CreateLinkDto(body);

    const currentTime = new Date().getTime();
    const expirationTimestamp =
      Math.floor(currentTime / 1000) + numberOfDays * 24 * 60 * 60;

    const newLink: Link = {
      id: v4().split("").splice(0, 6).join(""),
      userId: user.id,
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

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newLink,
      }),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
