import { configureStore } from "@reduxjs/toolkit";
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
  },
});

export default store;
