import { DynamoDB } from "aws-sdk";
import { RegisterCustomerDto } from "../../dtos/RegisterCustomerDto";
import { LoginCustomerDto } from "../../dtos/LoginCustomer";
import { compareSync } from "bcryptjs";
import { IUser } from "../../types/User";
import { serializeUserInfoAndJWT } from "../../services/token";

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const dynamodb = new DynamoDB.DocumentClient();
  const { email, password } = LoginCustomerDto(body);

  const userRes = await dynamodb
    .query({
      TableName: "CustomerTable",
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    })
    .promise();

  const user = userRes.Items ? (userRes.Items[0] as IUser) : null;

  if (!user) {
    throw new Error("User or password is incorrect, please try again");
  }

  const passwordsEqual = compareSync(password, user.password);
  if (!passwordsEqual)
    throw new Error("User or password is incorrect, please try again");

  const userDataAndJWT = await serializeUserInfoAndJWT(user);

  return { status: 200, data: userDataAndJWT };
};
