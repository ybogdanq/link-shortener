import { DynamoDB } from "aws-sdk";
import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { sendMail } from "../../utils/sendMail";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

export const handler = async (event) => {
  try {
    const dynamodb = new DynamoDB.DocumentClient();

    const record = event.Records[0];
    const messageBody = JSON.parse(record.body);

    const userId = messageBody.userId;
    const linkId = messageBody.linkId;
    console.log("USER ID ==> ", messageBody.userId);
    console.log("LINK ID ==> ", messageBody.linkId);

    // Fetch user's email address from your database based on userId
    const existingUser = await dynamodb
      .get({
        TableName: "CustomerTable",
        Key: { id: userId },
      })
      .promise();
    if (!existingUser.Item) {
      throw ApiError.BadRequest("User doesn't exist");
    }

    const user = existingUser.Item as IUser;

    const res = await sendMail(
      [user.email],
      "Link Deleted Notification",
      `Your link with ID ${linkId} has been deleted.`
    );

    console.log(res);

    return successResponse({
      statusCode: 200,
      body: "Email sent successfully",
    });
  } catch (error) {
    return errorResponse({
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
