import { CustomerDto } from "../dtos/CustomerDto";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ReturnType<typeof CustomerDto>;
}
