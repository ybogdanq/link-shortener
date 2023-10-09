import { IUserRequest, IUserResponse } from "app/types/User";

export interface AuthState {
  isAuth: boolean;
  error: string | null;
}

export interface ILoginUserAction {
  email: string;
  password: string;
}

export interface IRegisterUserAction {
  user: IUserRequest;
}
