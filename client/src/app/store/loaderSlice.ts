import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface LoaderState {
  isLoading: boolean;
}

const initialState: LoaderState = {
  isLoading: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setIsLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoadingState = (state: RootState) =>
  state.loader.isLoading;

export default loaderSlice.reducer;
