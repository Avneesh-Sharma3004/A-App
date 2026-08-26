import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getAllUsers,
} from "../../services/usersapi";

const initialState = {
  users: [],
  searchUsers: [], // Search ke results

  followers: [],
  following: [],

  totalUsers: 0,
  totalFollowers: 0,
  totalFollowing: 0,
  searchLoading: false,

  loading: false,
  error: null,
};

export const followUserThunk = createAsyncThunk(
  "user/follow",
  async (userId, thunkAPI) => {
    try {
      const response = await followUser(userId);
      // console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

export const unfollowUserThunk = createAsyncThunk(
  "user/unfollow",
  async (userId, thunkAPI) => {
    try {
      const response = await unfollowUser(userId);
      // console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },
);

export const getFollowersThunk = createAsyncThunk(
  "user/getFollowers",
  async (userId, thunkAPI) => {
    try {
      const response = await getFollowers(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch followers",
      );
    }
  },
);

export const getFollowingThunk = createAsyncThunk(
  "user/getFollowing",
  async (userId, thunkAPI) => {
    try {
      const response = await getFollowing(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch following",
      );
    }
  },
);

export const getAllUsersThunk = createAsyncThunk(
  "user/getAllUsers",
  async (search = "", thunkAPI) => {
    try {
      const response = await getAllUsers(search);
      // console.log("API Response:", response);
      return response;
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

export const searchUsersThunk = createAsyncThunk(
  "user/searchUsers",
  async (search = "", thunkAPI) => {
    try {
      const response = await getAllUsers(search);
      return response;
    } catch (error) {
      console.log("Search API Error:", error.response?.data || error.message);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to search users",
      );
    }
  },
);
const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Follow
      .addCase(followUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.totalFollowers = action.payload.followers;
        state.totalFollowing = action.payload.following;

        const user = state.users.find((item) => item._id === action.meta.arg);

        if (user) {
          user.isFollowed = true;
          user.followers += 1;
        }
      })

      .addCase(followUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unfollow
      .addCase(unfollowUserThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.totalFollowers = action.payload.followers;
        state.totalFollowing = action.payload.following;

        const user = state.users.find((item) => item._id === action.meta.arg);

        if (user) {
          user.isFollowed = false;
          user.followers = Math.max(0, user.followers - 1);
        }
      })

      .addCase(unfollowUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Followers
      .addCase(getFollowersThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(getFollowersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.totalFollowers = action.payload.totalFollowers;
      })

      .addCase(getFollowersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Following
      .addCase(getFollowingThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(getFollowingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.following;
        state.totalFollowing = action.payload.totalFollowing;
      })

      .addCase(getFollowingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Users
      .addCase(getAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })

      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Users

      .addCase(searchUsersThunk.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })

      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.searchLoading = false;

        state.searchUsers = action.payload.users;
      })

      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.searchLoading = false;

        state.searchUsers = [];
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
