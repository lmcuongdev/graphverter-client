import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import sessionSlice from "./slices/sessionSlice";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    project: projectSlice.reducer,
    sessions: sessionSlice.reducer,
  },
});

export default store;
