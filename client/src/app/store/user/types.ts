import { IUserRequest, IUserResponse } from "app/types/User";

export interface UserState {
  user: null | IUserResponse;
}

export interface ILoginUserAction {
  email: string;
  password: string;
}

export interface IRegisterUserAction {
  user: IUserRequest;
}
