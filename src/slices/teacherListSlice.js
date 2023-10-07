import { createSlice } from "@reduxjs/toolkit";

export const teacherListSlice = createSlice({
  name: "teacherList",
  initialState: {
    data: localStorage.getItem("listTeacher")
    ? JSON.parse(localStorage.getItem("listTeacher"))
    : [],
  },
  reducers: {
    updateTeacherList: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTeacherList } = teacherListSlice.actions;

export default teacherListSlice.reducer;
