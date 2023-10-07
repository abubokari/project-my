import { createSlice } from "@reduxjs/toolkit";

export const teacherSupportStopSlice = createSlice({
  name: "studentSupportStop",
  initialState: {
    status: localStorage.getItem("teacherSupportStop")
    ? JSON.parse(localStorage.getItem("teacherSupportStop"))
    : [],
  },
  reducers: {
    supportStopStatusTeacher: (state, action) => {
      state.status = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { supportStopStatusTeacher } = teacherSupportStopSlice.actions;

export default teacherSupportStopSlice.reducer;


