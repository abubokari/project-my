import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userId",
  initialState: {
    user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;




