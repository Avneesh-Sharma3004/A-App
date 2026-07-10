import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { createPost, getpost } from "../../services/postapi";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  createLoading: false,
};

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await getpost();
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const createPostThunk = createAsyncThunk(
  "post/createPost",
  async (FormData, thunkAPI) => {
    try {
      const response = await createPost(FormData);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went worng",
      );
    }
  },
);

const postSlice = createSlice({
  name: "post",

  initialState,

  reducers: {
    clearPosts(state) {
      state.posts = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // Pending
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Success
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      // Failed
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Create Post

      .addCase(createPostThunk.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
      })

      .addCase(createPostThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPosts } = postSlice.actions;

export default postSlice.reducer;
