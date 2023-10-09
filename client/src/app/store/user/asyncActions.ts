import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { AuthResponse } from "../../types/AuthorizationRes";
import { AxiosResponse } from "axios";
import { ILoginUserAction, IRegisterUserAction } from "./types";
import AuthService from "../../services/AuthService";
import defineApiErrorMsg from "../../utils/defineApiErrorMsg";
import { IUserResponse } from "../../types/User";

export const loginUser = createAsyncThunk<
  AxiosResponse<AuthResponse>,
  ILoginUserAction,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await AuthService.login(email, password);
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    return await AuthService.logout();
  } catch (error) {
    return isRejectedWithValue(defineApiErrorMsg(error));
  }
});

export const registerUser = createAsyncThunk<
  AxiosResponse<IUserResponse>,
  IRegisterUserAction,
  { rejectValue: string }
>("auth/registerUser", async ({ user }, { rejectWithValue }) => {
  try {
    return await AuthService.registerUser(user);
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});
