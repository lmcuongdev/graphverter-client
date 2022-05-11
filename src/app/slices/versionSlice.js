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

const deploy = createAsyncThunk("projects/deploy", async ({ projectId }) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/versions`);
    return response;
  } catch (err) {
    throw Error(err.error_message);
  }
});

export const deployAndReloadVersion = createAsyncThunk(
  "projects/deployAndReloadVersion",
  async ({ projectId }, { dispatch }) => {
    await dispatch(deploy({ projectId }));
    await dispatch(getLatestVersion({ projectId }));
  }
);

const versionSlice = createSlice({
  name: "versions",
  initialState: {
    version: null,
    loading: true,
    error: null,
    isDeploying: false,
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
    [deploy.pending]: (state, action) => {
      state.isDeploying = true;
    },
    [deploy.fulfilled]: (state, action) => {
      toast.success("Deployed successfully!");
      state.isDeploying = false;
    },
    [deploy.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      toast.error(error);
      state.isDeploying = false;
    },
  },
});

export const versionActions = versionSlice.actions;
export default versionSlice;
