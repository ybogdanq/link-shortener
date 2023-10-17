import { successResponse } from "../../utils/responses/successResponse";
import { deactivateLinkService } from "../../services/link";
import { dynamodb } from "../../utils/clients/db";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Link } from "../../types/Link";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const currentTimestamp = Date.now();

  const linksToDeactivate = await dynamodb.send(
    new ScanCommand({
      TableName: "LinkTable",
      FilterExpression:
        "expiredAt < :currentTimestamp AND active = :activeLinks",
      ExpressionAttributeValues: {
        ":currentTimestamp": currentTimestamp,
        ":activeLinks": true,
      },
    })
  );

  if (!linksToDeactivate.Items) {
    throw new Error("No links to be deleted.");
  }
  const deactivatedLinks: Link[] = [];
  for (let item of linksToDeactivate.Items) {
    const link = item as Link;
    deactivatedLinks.push(await deactivateLinkService(link.id));
  }

  console.log("deactivatedLinks ===>", deactivatedLinks);
  return successResponse({
    event,
    statusCode: 200,
    body: JSON.stringify(deactivatedLinks),
  });
};
