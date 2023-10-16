import { createAsyncThunk } from "@reduxjs/toolkit";
import LinkService from "app/services/LinkService";
import { ILinkRequest, ILinkResponse } from "app/types/Link";
import defineApiErrorMsg from "app/utils/defineApiErrorMsg";
import { AxiosResponse } from "axios";
import { setIsLoading } from "../loaderSlice";

export const getAllLinks = createAsyncThunk<
  AxiosResponse<ILinkResponse[]>,
  void,
  { rejectValue: string }
>("auth/getAllLinks", async (arg, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await LinkService.getAll();
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const getLinkById = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/getLinkById", async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await LinkService.getLinkById({ id });
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const createLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  ILinkRequest,
  { rejectValue: string }
>("auth/createLink", async (arg, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await LinkService.create(arg);
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const deactivateLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/deactivateLink", async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    const linkRes = await LinkService.deactivate({ id });
    await dispatch(getLinkById({ id }));
    return linkRes;
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const deleteLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/deleteLink", async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    return await LinkService.delete({ id });
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  } finally {
    dispatch(setIsLoading(false));
  }
});
