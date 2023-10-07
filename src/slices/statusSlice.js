import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    statusCondition: localStorage.getItem("status")
    ? JSON.parse(localStorage.getItem("status"))
    : false,
  },
  reducers: {
    changeStatus: (state, action) => {
      state.statusCondition = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeStatus } = statusSlice.actions;

export default statusSlice.reducer;
