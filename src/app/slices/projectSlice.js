import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api-client";

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

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loadingProjects: true,
    project: null,
    error: null,
  },
  reducers: {},
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
