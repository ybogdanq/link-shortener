import { AxiosResponse } from "axios";
import $api from "../http/index";
import { ApiRoutes } from "../types/ApiRoutes";
import { IUserResponse } from "../types/User";
import { ILinkRequest, ILinkResponse } from "app/types/Link";

class UserService {
  static async getUser(): Promise<AxiosResponse<IUserResponse>> {
    return $api.get(ApiRoutes.GetUser);
  }
}

export default UserService;
