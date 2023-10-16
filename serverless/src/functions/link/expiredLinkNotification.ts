import ApiError from "../../exceptions/apiError";
import { IUser } from "../../types/User";
import { sendMail } from "../../utils/sendMail";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";
import { dynamodb } from "../../utils/clients/db";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const record = event.Records[0];
  const messageBody = JSON.parse(record.body);

  const userId = messageBody.userId;
  const linkId = messageBody.linkId;

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
};
