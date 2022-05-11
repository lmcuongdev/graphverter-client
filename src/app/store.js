import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import projectSlice from "./slices/projectSlice";
import sessionSlice from "./slices/sessionSlice";
import uiSlice from "./slices/uiSlice";
import versionSlice from "./slices/versionSlice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    project: projectSlice.reducer,
    sessions: sessionSlice.reducer,
    versions: versionSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
