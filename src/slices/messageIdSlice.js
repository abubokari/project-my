import { createSlice } from "@reduxjs/toolkit";

export const messageIdSlice = createSlice({
  name: "messageId",
  initialState: {
    data: localStorage.getItem("messageId")
      ? JSON.parse(localStorage.getItem("messageId"))
      : [],
  },
  reducers: {
    updateMessageId: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMessageId } = messageIdSlice.actions;

export default messageIdSlice.reducer;
