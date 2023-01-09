import { createSlice } from "@reduxjs/toolkit";

export const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    status: true,
  },
  reducers: {
    toggle: (state, action) => {
      const to = action.payload;
      console.log(to);
      state.status = to;
    },
  },
});

export const { toggle } = cameraSlice.actions;
export default cameraSlice.reducer;
