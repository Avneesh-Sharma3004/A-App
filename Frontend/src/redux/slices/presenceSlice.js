import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  onlineUsers: [],
};

const presenceSlice = createSlice({
  name: "presence",

  initialState,

  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    userOnline: (state, action) => {
      const userId = action.payload;

      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },

    userOffline: (state, action) => {
      const userId = action.payload;

      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
    },

    // 👇 Initial status check
    setUserOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;

      if (isOnline) {
        if (!state.onlineUsers.includes(userId)) {
          state.onlineUsers.push(userId);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      }
    },
  },
});

export const { setOnlineUsers, userOnline, userOffline, setUserOnlineStatus } =
  presenceSlice.actions;

export default presenceSlice.reducer;
