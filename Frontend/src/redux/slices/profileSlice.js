// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfileDetails,
  getOtherProfileDetails,
} from "../../services/profileapi";

const initialState = {
  // My Profile
  profile: null,
  posts: [],
  isFollowed: false,

  // Other Profile
  otherProfile: null,
  otherPosts: [],
  otherIsFollowed: false,

  loading: false,
  otherProfileLoading: false,

  error: null,
  otherProfileError: null,
};

// ===============================
// MY PROFILE
// ===============================
export const getProfileThunk = createAsyncThunk(
  "profile/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getProfileDetails();

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

// ===============================
// OTHER USER PROFILE
// ===============================
export const getOtherProfileThunk = createAsyncThunk(
  "profile/getOtherProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await getOtherProfileDetails(userId);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch other profile",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===============================
      // MY PROFILE
      // ===============================
      .addCase(getProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.profile = action.payload.user;
        state.posts = action.payload.posts || [];
        state.isFollowed = action.payload.isFollowed || false;
      })

      .addCase(getProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================
      // OTHER USER PROFILE
      // ===============================
      .addCase(getOtherProfileThunk.pending, (state) => {
        state.otherProfileLoading = true;
        state.otherProfileError = null;
      })

      .addCase(getOtherProfileThunk.fulfilled, (state, action) => {
        state.otherProfileLoading = false;

        state.otherProfile = action.payload.user;
        state.otherPosts = action.payload.posts || [];
        state.otherIsFollowed = action.payload.isFollowed || false;
      })

      .addCase(getOtherProfileThunk.rejected, (state, action) => {
        state.otherProfileLoading = false;
        state.otherProfileError = action.payload;
      });
  },
});

export default profileSlice.reducer;
