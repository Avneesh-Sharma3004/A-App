import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
} from "../../services/messageapi";

const initialState = {
  messages: [],

  conversationId: null,

  totalMessages: 0,

  loading: false,
  sendLoading: false,
  readLoading: false,

  error: null,
};

export const getMessagesThunk = createAsyncThunk(
  "message/getMessages",
  async (userId, thunkAPI) => {
    try {
      const response = await getConversationMessages(userId);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const sendMessageThunk = createAsyncThunk(
  "message/sendMessage",
  async ({ receiverId, message }, thunkAPI) => {
    try {
      const response = await sendMessage(receiverId, message);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

export const markMessagesAsReadThunk = createAsyncThunk(
  "message/markMessagesAsRead",
  async (userId, thunkAPI) => {
    try {
      const response = await markMessagesAsRead(userId);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "message",

  initialState,

  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.conversationId = null;
      state.totalMessages = 0;
    },

    // 🔥 Socket se new message aayega
    addMessage: (state, action) => {
      const exists = state.messages.some(
        (message) => message._id === action.payload._id,
      );

      // Duplicate message nahi add hoga
      if (!exists) {
        state.messages.push(action.payload);
        state.totalMessages += 1;
      }
    },

    // Socket se read event
    markMessagesRead: (state, action) => {
      const { conversationId, senderId, readAt } = action.payload;

      state.messages.forEach((message) => {
        const messageSenderId = message.sender?._id || message.sender;

        if (
          message.conversation === conversationId &&
          messageSenderId === senderId
        ) {
          message.isRead = true;
          message.readAt = readAt;
        }
      });
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // GET MESSAGES
      // =========================

      .addCase(getMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.conversationId = action.payload.conversation;

        state.messages = action.payload.messages;

        state.totalMessages = action.payload.totalMessages;
      })

      .addCase(getMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // SEND MESSAGE
      // =========================

      .addCase(sendMessageThunk.pending, (state) => {
        state.sendLoading = true;
        state.error = null;
      })

      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.sendLoading = false;

        const message = action.payload.data;

        state.messages.push(message);
        state.totalMessages += 1;

        if (!state.conversationId) {
          state.conversationId = message.conversation;
        }
      })

      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.sendLoading = false;
        state.error = action.payload;
      })

      // =========================
      // MARK READ
      // =========================

      .addCase(markMessagesAsReadThunk.pending, (state) => {
        state.readLoading = true;
      })

      .addCase(markMessagesAsReadThunk.fulfilled, (state) => {
        state.readLoading = false;
      })

      .addCase(markMessagesAsReadThunk.rejected, (state, action) => {
        state.readLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, addMessage, markMessagesRead } =
  messageSlice.actions;

export default messageSlice.reducer;
