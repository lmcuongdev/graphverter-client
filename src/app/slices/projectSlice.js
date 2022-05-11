import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api-client";
import { getSession } from "./sessionSlice";
import { getLatestVersion } from "./versionSlice";

export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async () => {
    try {
      const response = await apiClient.get("/projects");
      return response.items;
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

export const getProjectById = createAsyncThunk(
  "projects/getProjectById",
  async (id) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response;
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

// Get project, session, and version data consecutively
export const getProjectPageData = createAsyncThunk(
  "projects/getProjectPageData",
  async (projectId, { dispatch }) => {
    const data = await dispatch(getProjectById(projectId));
    await dispatch(
      getSession({ projectId, sessionId: data.payload.session.id })
    );
    await dispatch(getLatestVersion({ projectId }));
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loadingProjects: true,
    project: null,
    error: null,
  },
  reducers: {
    setDeploy: (state, action) => {
      state.project.is_deployed = action.payload;
    },
  },
  extraReducers: {
    [getProjects.pending]: (state, action) => {
      state.loadingProjects = true;
    },
    [getProjects.fulfilled]: (state, action) => {
      state.projects = action.payload;
      state.loadingProjects = false;
    },
    [getProjects.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      state.loadingProjects = false;
      toast.error(error);
    },
    [getProjectById.fulfilled]: (state, action) => {
      state.project = action.payload;
    },
    [getProjectById.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      toast.error(error);
    },
  },
});

export const projectActions = projectSlice.actions;
export default projectSlice;
