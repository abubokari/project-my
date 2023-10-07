import { configureStore } from "@reduxjs/toolkit";
import userAuthenticateReducer from "../slices/userAuthenticationSlice";
import statusSlice from "../slices/statusSlice";
import teacherStatusSlice from "../slices/teacherStatusSlice";
import studentRequestSlice from "../slices/studentRequestSlice";
import userInfoSlice from "../slices/userInfoSlice";
import messageListSlice from "../slices/messageListSlice";
import messageIdSlice from "../slices/messageIdSlice";
import teacherListSlice from "../slices/teacherListSlice";
import studentSupportStop from "../slices/studentSupportStopSlice";
import teacherSupportStop from "../slices/teacherSupportStopSlice";

export default configureStore({
  reducer: {
    userAuthenticate: userAuthenticateReducer,
    status: statusSlice,
    teacherToggle: teacherStatusSlice,
    allStudent: studentRequestSlice,
    user: userInfoSlice,
    messageList: messageListSlice,
    message: messageIdSlice,
    teacherList: teacherListSlice,
    supportStopStudent: studentSupportStop,
    supportStopTeacher: teacherSupportStop,
  },
});
