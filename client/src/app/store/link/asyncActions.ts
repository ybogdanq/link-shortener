import { createAsyncThunk } from "@reduxjs/toolkit";
import LinkService from "app/services/LinkService";
import { ILinkRequest, ILinkResponse } from "app/types/Link";
import defineApiErrorMsg from "app/utils/defineApiErrorMsg";
import { AxiosResponse } from "axios";

export const getAllLinks = createAsyncThunk<
  AxiosResponse<ILinkResponse[]>,
  void,
  { rejectValue: string }
>("auth/getAllLinks", async (arg, { rejectWithValue }) => {
  try {
    return await LinkService.getAll();
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});

export const getLinkById = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/getLinkById", async ({ id }, { rejectWithValue }) => {
  try {
    return await LinkService.getLinkById({ id });
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});

export const createLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  ILinkRequest,
  { rejectValue: string }
>("auth/createLink", async (arg, { rejectWithValue }) => {
  try {
    return await LinkService.create(arg);
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});

export const deactivateLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/deactivateLink", async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    const linkRes = await LinkService.deactivate({ id });
    await dispatch(getLinkById({ id }));
    return linkRes;
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});

export const deleteLink = createAsyncThunk<
  AxiosResponse<ILinkResponse>,
  { id: string },
  { rejectValue: string }
>("auth/deleteLink", async ({ id }, { rejectWithValue }) => {
  try {
    return await LinkService.delete({ id });
  } catch (error) {
    return rejectWithValue(defineApiErrorMsg(error));
  }
});
