import { CustomerDto } from "../dtos/CustomerDto";
import { IUser } from "./User";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<typeof CustomerDto>;
}
