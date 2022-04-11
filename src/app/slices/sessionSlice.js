import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api-client";

export const getSession = createAsyncThunk(
  "sessions/getSession",
  async ({ projectId, sessionId }) => {
    console.log(projectId, sessionId);
    try {
      return await apiClient.get(
        `/projects/${projectId}/sessions/${sessionId}`
      );
    } catch (err) {
      throw Error(err.error_message);
    }
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
        url: "https://app.sportdataapi.com/api/v1/soccer/topscorers",
        method: "GET",
        payloadJSON: "",
        responseJSON: JSON.stringify({ x: 1 }),
        suggestedSchemaText: "",
      },
    ],
    error: null,
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
  },
  extraReducers: {
    [getSession.pending]: (state, action) => {},
    [getSession.fulfilled]: (state, action) => {
      state.session = action.payload;
      state.schemaText = action.payload.meta_data.schema_text;
    },
    [getSession.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      state.error = error;
      toast.error(error);
    },
  },
});

export const sessionActions = sessionSlice.actions;
export default sessionSlice;
