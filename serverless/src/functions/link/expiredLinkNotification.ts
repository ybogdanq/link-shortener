import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { sendMail } from "../../utils/sendMail";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import { dynamodb } from "../../utils/db";
import { verifyEmailIdentity } from "../../utils/verifyEmailIdentity";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  try {
    await verifyEmailIdentity();
    const record = event.Records[0];
    const messageBody = JSON.parse(record.body);

    const userId = messageBody.userId;
    const linkId = messageBody.linkId;
    console.log("USER ID ==> ", messageBody.userId);
    console.log("LINK ID ==> ", messageBody.linkId);

    // Fetch user's email address from your database based on userId
    const existingUser = await dynamodb.send(
      new GetCommand({ TableName: "CustomerTable", Key: { id: userId } })
    );
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
      event,
      statusCode: 200,
      body: "Email sent successfully",
    });
  } catch (error) {
    return errorResponse({
      event,
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
