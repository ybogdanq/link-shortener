import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import ApiError from "../exceptions/apiError";
import { dynamodb } from "../utils/clients/db";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DBTables } from "../types/DBenums";
import { Link } from "../types/Link";

const { AWS_ACCOUNT_ID, SES_REGION } = process.env;

interface IGetLinkService {
  linkId: string;
  userId: string;
}
export const getLinkService = async ({ linkId, userId }: IGetLinkService) => {
  const linkQueryRes = await dynamodb.send(
    new QueryCommand({
      TableName: DBTables.LinkTable,
      IndexName: "UserIdIndex",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":id": linkId,
      },
    })
  );

  if (!linkQueryRes.Items || linkQueryRes.Items.length === 0) {
    throw ApiError.BadRequest("Bad link id provided");
  }
  return linkQueryRes.Items[0] as Link;
};

export const deactivateLinkService = async (linkId: string) => {
  const sqs = new SQSClient();
  const deactivatedLinkRes = await dynamodb.send(
    new UpdateCommand({
      TableName: DBTables.LinkTable,
      Key: {
        id: linkId,
      },
      UpdateExpression: "set active = :newActive",
      ExpressionAttributeValues: {
        ":newActive": false,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (!deactivatedLinkRes.Attributes && !deactivatedLinkRes) {
    throw ApiError.BadRequest("Link wasn't deactivated");
  }
  const deactivatedLink = deactivatedLinkRes.Attributes as Link;
  if (!deactivatedLink.id || !deactivatedLink.userId) {
    throw new Error("Deactivated link id or user id doesn't exist!");
  }

  const queueName: string = "LinkShortnerNotificationQueue";
  const queueUrl: string = `https://sqs.${SES_REGION}.amazonaws.com/${AWS_ACCOUNT_ID}/${queueName}`;

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        userId: deactivatedLink.userId,
        linkId: deactivatedLink.id,
      }),
    })
  );

  return deactivatedLink;
};
