import { Link } from "../../types/Link";
import { v4 } from "uuid";
import { createLinkDto } from "../../dtos/CreateLinkDto";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import * as middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { dynamodb } from "../../utils/clients/db";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  CreateScheduleCommand,
  CreateScheduleCommandInput,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
import { dateToCron } from "../../utils/dateToCron";
import { link } from "fs";
import { Handler } from "aws-lambda";

const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, AWS_ACCOUNT_ID } =
  process.env;

export const createLink: Handler = async (event) => {
  const scheduler = new SchedulerClient({
    region: SES_REGION || "",
    credentials: {
      accessKeyId: SES_ACCESS_KEY_ID || "",
      secretAccessKey: SES_SECRET_ACCESS_KEY || "",
    },
  });
  const { principalId: userId } = event.requestContext?.authorizer;
  const body = event.body;
  const { redirectLink, numberOfDays, type } = createLinkDto(body);

  const expirationTimestamp = Math.floor(
    Date.now() + numberOfDays * 24 * 60 * 60 * 1000
  );

  const newLink: Link = {
    id: v4().split("").splice(0, 6).join(""),
    userId: userId,
    type: type,
    active: true,
    redirectLink: redirectLink,
    visits: 0,
    expiredAt: expirationTimestamp,
  };

  await dynamodb.send(
    new PutCommand({ TableName: "LinkTable", Item: newLink })
  );

  const arn = `arn:aws:lambda:${SES_REGION}:${AWS_ACCOUNT_ID}:function:serverless-dev-deactivateLink`;
  // const arn = `arn:aws:sqs:eu-west-1:726141157734:LinkShortnerNotificationQueue`;
  const roleArn = `arn:aws:iam::726141157734:role/serverless-dev-eu-west-1-lambdaRole`;

  const scheduleInput: CreateScheduleCommandInput = {
    StartDate: new Date(),
    ActionAfterCompletion: "DELETE",
    Name: `LinkDeletionSchedule-${newLink.id}`,
    ScheduleExpression: `at(${dateToCron(expirationTimestamp)})`,
    ScheduleExpressionTimezone: "Europe/Warsaw",
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    Target: {
      Arn: arn,
      RoleArn: roleArn,
      Input: JSON.stringify({ userId: userId, linkId: newLink.id }),
      RetryPolicy: {
        MaximumRetryAttempts: 2,
      },
    },
  };

  const res = await scheduler.send(new CreateScheduleCommand(scheduleInput));

  console.log(res);

  return successResponse({
    event,
    statusCode: 200,
    body: { ...newLink },
  });
};

export const handler = middy
  .default(createLink)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(cors());
