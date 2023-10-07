import { createSlice } from "@reduxjs/toolkit";

export const messageListSlice = createSlice({
  name: "messageList",
  initialState: {
    data: localStorage.getItem("listMessage")
    ? JSON.parse(localStorage.getItem("listMessage"))
    : [],
  },
  reducers: {
    updateMessageList: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMessageList } = messageListSlice.actions;

export default messageListSlice.reducer;
