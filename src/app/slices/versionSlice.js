import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api-client";

export const getLatestVersion = createAsyncThunk(
  "versions/getLatestVersion",
  async ({ projectId }) => {
    try {
      const response = await apiClient.get(
        `/projects/${projectId}/versions/latest`
      );
      return response;
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

const versionSlice = createSlice({
  name: "versions",
  initialState: {
    version: null,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getLatestVersion.pending]: (state, action) => {
      state.loading = true;
    },
    [getLatestVersion.fulfilled]: (state, action) => {
      state.version = action.payload;
      state.loading = false;
    },
    [getLatestVersion.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      state.loading = false;
      toast.error(error);
    },
  },
});

export const versionActions = versionSlice.actions;
export default versionSlice;
