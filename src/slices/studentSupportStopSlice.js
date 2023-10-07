import { createSlice } from "@reduxjs/toolkit";

export const studentSupportStopSlice = createSlice({
  name: "studentSupportStop",
  initialState: {
    status: localStorage.getItem("studentSupportStop")
    ? JSON.parse(localStorage.getItem("studentSupportStop"))
    : false,
  },
  reducers: {
    supportStopStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { supportStopStatus } = studentSupportStopSlice.actions;

export default studentSupportStopSlice.reducer;


