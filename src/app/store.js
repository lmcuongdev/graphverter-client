import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./slices/projectSlice";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    project: projectSlice.reducer,
  },
});

export default store;
