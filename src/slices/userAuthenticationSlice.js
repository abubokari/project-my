import { createSlice } from "@reduxjs/toolkit";

export const userAuthenticateSlice = createSlice({
  name: "userAuthentication",
  initialState: {
    userInfo: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : 'logout',
  },
  reducers: {
    activeUser: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { activeUser } = userAuthenticateSlice.actions;

export default userAuthenticateSlice.reducer;
