import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postslice";
import authReducer from "./slices/authslice";
import profileReducer from "./slices/profileSlice";
import storyReducer from "./slices/storyslice";
import userReducer from "./slices/userslice";
import messageReducer from "./slices/messageslice";
import presenceReducer from "./slices/presenceSlice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    auth: authReducer,
    profile: profileReducer,
    story: storyReducer,
    user: userReducer,
    message: messageReducer,
    presence: presenceReducer,
  },
});
