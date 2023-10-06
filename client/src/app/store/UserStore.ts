import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type IUser = {};

interface UserState {
  user: null | IUser;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
