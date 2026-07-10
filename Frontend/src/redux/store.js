import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postslice";
import authReducer from"./slices/authslice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    auth:authReducer,
  },
});