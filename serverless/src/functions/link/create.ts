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
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
import { dateToCron } from "../../utils/dateToCron";

const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY } = process.env;

export const createLink = async (event) => {
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

  const res = scheduler.send(
    new CreateScheduleCommand({
      Name: `LinkDeletionSchedule-${newLink.id}`,
      ScheduleExpression: `at(${dateToCron(expirationTimestamp)})`,
      FlexibleTimeWindow: {
        MaximumWindowInMinutes: 60,
        Mode: "FLEXIBLE",
      },
      Target: {
        Arn: "",
        RoleArn: "",
        SqsParameters: {
          
        }
      },
    })
  );

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
