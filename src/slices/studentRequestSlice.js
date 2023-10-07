import { createSlice } from "@reduxjs/toolkit";

export const studentRequestSlice = createSlice({
  name: "student",
  initialState: {
    data: localStorage.getItem("listStudent")
    ? JSON.parse(localStorage.getItem("listStudent"))
    : [],
  },
  reducers: {
    updateStudent: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateStudent } = studentRequestSlice.actions;

export default studentRequestSlice.reducer;
