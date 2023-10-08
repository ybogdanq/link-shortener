import { DynamoDB } from "aws-sdk";
import { RegisterCustomerDto } from "../../dtos/RegisterCustomerDto";

module.exports.handler = async (event) => {
  return { status: 201, body: event };
};
