import { verifyToken } from "./verifyToken";

export const handler = async (event) => {
  try {
    const user = verifyToken(event);
    if (!user) {
      throw new Error("User unauthorized");
    }
  } catch (error) {
    console.log(error);
    return { statusCode: error?.status || 400, message: error.message };
  }
};
