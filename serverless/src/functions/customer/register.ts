import { DynamoDB } from "aws-sdk";
import { RegisterCustomerDto } from "../../dtos/RegisterCustomerDto";
import { v4 } from "uuid";
import { hash } from "bcrypt";

console.log(process.env.JWT_ACCESS_SECRET);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const dynamodb = new DynamoDB.DocumentClient();

    const { user } = RegisterCustomerDto(body);

    const { email, password } = user;
    const hashPassword = await hash(password, 10);

    const existingUser = await dynamodb
      .query({
        TableName: "CustomerTable",
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();

    console.log(existingUser);

    if (existingUser.Items && existingUser.Items.length > 0) {
      throw new Error("User already exists");
    }

    const newUser = {
      ...user,
      id: v4(),
      password: hashPassword,
    };

    await dynamodb
      .put({
        TableName: "CustomerTable",
        Item: newUser,
        ConditionExpression: "attribute_not_exists(email)",
      })
      .promise();

    return { status: 201, body: { user: newUser } };
  } catch (error) {
    return { status: 400, message: error.message };
  }
};
