import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDB();
export const dynamodb = DynamoDBDocumentClient.from(dynamoClient);
