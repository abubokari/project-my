import { createSlice } from "@reduxjs/toolkit";

export const teacherStatusSlice = createSlice({
  name: "teacher",
  initialState: {
    statusCondition: localStorage.getItem("teacherStatus")
    ? JSON.parse(localStorage.getItem("teacherStatus"))
    : true,
  },
  reducers: {
    changeStatust: (state, action) => {
      state.statusCondition = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeStatust } = teacherStatusSlice.actions;

export default teacherStatusSlice.reducer;
