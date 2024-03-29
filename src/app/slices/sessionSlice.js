import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toCamelCase, toSnakeCase } from "utils/common";
import apiClient from "../../api-client";
import { getLatestVersion } from "./versionSlice";

export const getSession = createAsyncThunk(
  "sessions/getSession",
  async ({ projectId, sessionId }) => {
    console.log(projectId, sessionId);
    try {
      const response = await apiClient.get(
        `/projects/${projectId}/sessions/${sessionId}`
      );
      console.log(toCamelCase(response));
      return toCamelCase(response);
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

const updateSession = createAsyncThunk(
  "sessions/saveSession",
  async ({ projectId, sessionId, data }) => {
    try {
      const response = await apiClient.put(
        `/projects/${projectId}/sessions/${sessionId}`,
        toSnakeCase(data)
      );
      return toCamelCase(response);
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

export const updateAndReloadSession = createAsyncThunk(
  "sessions/updateAndReloadSession",
  async (args, { dispatch }) => {
    await dispatch(updateSession(args));
    await dispatch(
      getSession({ projectId: args.projectId, sessionId: args.sessionId })
    );
    await dispatch(getLatestVersion({ projectId: args.projectId }));
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    session: null,
    schemaText: "",
    endpoints: [
      {
        // TODO: Add more
        queryName: "",
        url: "https://app.sportdataapi.com/api/v1/soccer/topscorers",
        method: "GET",
        payloadJson: "",
        responseJson: JSON.stringify({ x: 1 }),
        suggestedSchemaText: "",
      },
    ],
    error: null,
    shouldReloadSession: true,
  },
  reducers: {
    suggestSchema: (state, action) => {
      // Get endpoints array index
      const { index, schema } = action.payload;
      state.endpoints[index].suggestedSchemaText = schema;
    },
    handleEndpointDataChange(state, action) {
      const { index, type, value } = action.payload;
      state.endpoints[index][type] = value.trim();
    },
    addEndpoint: (state, action) => {
      state.endpoints.push({
        queryName: "",
        url: "",
        method: "GET",
        payloadJson: "",
        responseJson: "",
        suggestedSchemaText: "",
      });
    },
    removeEndpoint: (state, action) => {
      state.endpoints.splice(action.payload, 1);
    },
  },
  extraReducers: {
    [getSession.pending]: (state, action) => {},
    [getSession.fulfilled]: (state, action) => {
      state.session = action.payload;
      state.schemaText = action.payload.metaData.schemaText;
      state.endpoints = action.payload.metaData.endpoints;
      state.shouldReloadSession = false;
    },
    [getSession.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      toast.error(error);
      state.shouldReloadSession = false;
    },
    [updateSession.pending]: (state, action) => {},
    [updateSession.fulfilled]: (state, action) => {
      state.shouldReloadSession = true;
      toast.success("Session saved!");
    },
    [updateSession.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      toast.error(error);
    },
  },
});

export const sessionActions = sessionSlice.actions;
export default sessionSlice;
