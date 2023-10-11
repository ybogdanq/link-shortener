import { removeToken } from "../../services/token";
import { errorResponse } from "../../utils/responses/errorResponse";
import { successResponse } from "../../utils/responses/successResponse";

export const handler = async (event) => {
  try {
    const { principalId: userId } = event.requestContext?.authorizer;
    console.log("Deactivate link auth User ==> ", userId);

    await removeToken(userId);

    return successResponse({
      statusCode: 200,
      headers: {
        "Set-Cookie":
          "refreshToken=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
      body: {},
    });
  } catch (error) {
    return errorResponse({
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    });
  }
};
