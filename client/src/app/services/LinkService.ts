import { AxiosResponse } from "axios";
import $api from "../http/index";
import { ApiRoutes } from "../types/ApiRoutes";
import { IUserResponse } from "../types/User";
import { ILinkRequest, ILinkResponse } from "app/types/Link";

class LinkService {
  static async getAll(): Promise<AxiosResponse<ILinkResponse[]>> {
    return $api.get(ApiRoutes.GetAllLinks);
  }

  static async create({
    redirectLink,
    numberOfDays,
    type,
  }: ILinkRequest): Promise<AxiosResponse<ILinkResponse>> {
    return $api.post<ILinkResponse>(ApiRoutes.CreateLink, {
      redirectLink,
      numberOfDays,
      type,
    });
  }

  static async deactivate({
    id,
  }: {
    id: string;
  }): Promise<AxiosResponse<ILinkResponse>> {
    return $api.patch<ILinkResponse>(ApiRoutes.DeactivateLink + id);
  }

  static async delete({
    id,
  }: {
    id: string;
  }): Promise<AxiosResponse<ILinkResponse>> {
    return $api.delete<ILinkResponse>(ApiRoutes.DeleteLink + id);
  }
}

export default LinkService;
