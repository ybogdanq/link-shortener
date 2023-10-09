import { AxiosResponse } from "axios";
import $api from "../http/index";
import { ApiRoutes } from "../types/ApiRoutes";
import { AuthResponse } from "../types/AuthorizationRes";
import { IUserRequest, IUserResponse } from "../types/User";

class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>(ApiRoutes.Login, {
      email,
      password,
    });
  }

  static async registerUser(
    user: IUserRequest
  ): Promise<AxiosResponse<IUserResponse>> {
    return $api.post<IUserResponse>(ApiRoutes.Register, {
      user,
    });
  }

  static async logout(): Promise<void> {
    return $api.post(ApiRoutes.Logout);
  }
}

export default AuthService;
