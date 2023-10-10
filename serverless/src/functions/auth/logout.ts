import { removeToken } from "../../services/token";
import { verifyUser } from "../../utils/verifyUser";

export const handler = async (event) => {
  try {
    const user = verifyUser(event);

    await removeToken(user.id);

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie":
          "refreshToken=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };
  } catch (error) {
    return {
      statusCode: error?.status || 500,
      body: error.message || "Unhandled error",
    };
  }
};
