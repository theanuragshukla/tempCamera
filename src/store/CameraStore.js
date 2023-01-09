import { configureStore } from "@reduxjs/toolkit";
import cameraSlice from "./cameraSlice";
import loginSlice from "./loginSlice";
export default configureStore({
  reducer: {
    camera: cameraSlice,
    login: loginSlice,
  },
});
