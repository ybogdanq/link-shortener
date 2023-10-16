import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { AuthResponse } from "../../types/AuthorizationRes";
import { AxiosResponse } from "axios";
import { ILoginUserAction, IRegisterUserAction } from "./types";
import AuthService from "../../services/AuthService";
import defineApiErrorMsg from "../../utils/defineApiErrorMsg";
import { IUserResponse } from "../../types/User";
import UserService from "app/services/UserService";
import { setIsLoading } from "../loaderSlice";

export const getUser = createAsyncThunk<
  AxiosResponse<IUserResponse>,
  void,
  { rejectValue: string }
>("auth/getUser", async (arg, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await UserService.getUser();
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const loginUser = createAsyncThunk<
  AxiosResponse<AuthResponse>,
  ILoginUserAction,
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      return await AuthService.login(email, password);
    } catch (error) {
      return rejectWithValue(defineApiErrorMsg(error));
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (arg, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      return await AuthService.logout();
    } catch (error) {
      return isRejectedWithValue(defineApiErrorMsg(error));
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const registerUser = createAsyncThunk<
  AxiosResponse<IUserResponse>,
  IRegisterUserAction,
  { rejectValue: string }
>("auth/registerUser", async ({ user }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await AuthService.registerUser(user);
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});
