import { UserRes } from "./Arguments/Auth";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserRes;
}
