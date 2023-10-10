import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ILinkResponse } from "app/types/Link";
import { LinkState } from "./types";
import {
  createLink,
  deactivateLink,
  deleteLink,
  getAllLinks,
} from "./asyncActions";

const initialState: LinkState = {
  links: [],
};

export const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    visitLink: (state, { payload }: { payload: { id: string } }) => {
      state.links = state.links.map((link) => {
        if (link.id === payload.id) {
          return {
            ...link,
            visits: link.visits + 1,
          };
        }
        return link;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLinks.fulfilled, (state, { payload }) => {
        state.links = payload.data;
      })
      .addCase(createLink.fulfilled, (state, { payload }) => {
        state.links.push(payload.data);
      })
      .addCase(deactivateLink.fulfilled, (state, { payload }) => {
        state.links = state.links.map((link) => {
          if (link.id === payload.data.id) {
            return { ...link, active: false };
          }
          return link;
        });
      })
      .addCase(deleteLink.fulfilled, (state, { payload }) => {
        state.links = state.links.filter((link) => link.id !== payload.data.id);
      });
  },
});

export const { visitLink } = linkSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLinks = (state: RootState) => state.link.links;

export default linkSlice.reducer;
