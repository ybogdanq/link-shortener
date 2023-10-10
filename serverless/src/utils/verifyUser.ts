import ApiError from "../exceptions/apiError";
import { validateAccesstoken } from "../services/token";
import { IUser } from "../types/User";

export const verifyUser = (event) => {
  const authorization: string = event.headers
    ? event.headers["Authorization"]
    : null;
  if (!authorization) {
    throw ApiError.UnauthorizedError();
  }
  console.log(authorization, "authorization \n\n\n");
  const [type, token] = authorization.split(" ");
  if (type.toLowerCase() !== "bearer" || !token) {
    throw ApiError.UnauthorizedError();
  }
console.log(token, "token \n\n\n");
  const user = validateAccesstoken<IUser>(token);
  if (!user) {
    throw ApiError.UnauthorizedError();
  }
console.log(user, "user \n\n\n");
  return user;
};