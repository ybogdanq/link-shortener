import ApiError from "../../exceptions/apiError";
import { successResponse } from "../../utils/responses/successResponse";
import { deactivateLinkService } from "../../services/link";

export const handler = async (event, context) => {
  const expiredLinkId: string | undefined = event.detail.id;
  console.log("Expired link ====>>>", expiredLinkId);
  if (!expiredLinkId) {
    throw ApiError.BadRequest("Bad link id provided");
  }
  const deactivatedLink = await deactivateLinkService(
    expiredLinkId,
    context.invokedFunctionArn
  );

  return successResponse({
    event,
    statusCode: 200,
    body: JSON.stringify(deactivatedLink),
  });
};
