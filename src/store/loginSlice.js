import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    status: false,
  },
  reducers: {
    updateLogin: (state, action) => {
      const to = action.payload;
      state.status = to;
    },
  },
});

export const { updateLogin } = loginSlice.actions;
export default loginSlice.reducer;
