import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfileDetails } from "../../services/profileapi";

const initialState = {
  profile: null,
  posts: [],
  postCount: 0,
  followers: 0,
  following: 0,
  loading: false,
  error: null,
};

export const getProfileThunk = createAsyncThunk(
  "profile/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getProfileDetails();

      // console.log("Profile Response =>", response);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
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

      .addCase(getProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.profile = action.payload.user;
        state.posts = action.payload.posts;
        state.postCount = action.payload.postCount;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
