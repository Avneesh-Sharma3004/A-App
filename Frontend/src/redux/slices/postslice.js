import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getComments,
  getpost,
  getPostLikes,
  likePost,
} from "../../services/postapi";
const initialState = {
  posts: [],
  loading: false,
  error: null,

  createLoading: false,
  deleteLoading: false,

  likesByPost: {},
  totalLikes: 0,

  commentsByPost: {},
  totalComments: 0,
  commentLoading: false,
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

export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id, thunkAPI) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went worng",
      );
    }
  },
);

export const likePostThunk = createAsyncThunk(
  "post/likePost",
  async (postId, thunkAPI) => {
    try {
      const response = await likePost(postId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to like post",
      );
    }
  },
);

// Get Likes
export const getPostLikesThunk = createAsyncThunk(
  "post/getLikes",
  async (postId, thunkAPI) => {
    try {
      const response = await getPostLikes(postId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch likes",
      );
    }
  },
);

// Add Comment
export const addCommentThunk = createAsyncThunk(
  "post/addComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      const response = await addComment(postId, text);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

// Get Comments
export const getCommentsThunk = createAsyncThunk(
  "post/getComments",
  async (postId, thunkAPI) => {
    try {
      const response = await getComments(postId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments",
      );
    }
  },
);

// Delete Comment
export const deleteCommentThunk = createAsyncThunk(
  "post/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      await deleteComment(postId, commentId);

      return {
        postId,
        commentId,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
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
      })

      .addCase(deletePostThunk.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;

        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })

      .addCase(deletePostThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      .addCase(getPostLikesThunk.fulfilled, (state, action) => {
        const postId = action.meta.arg;

        state.likesByPost[postId] = {
          totalLikes: action.payload.totalLikes,
          likes: action.payload.likes,
        };
      })

      .addCase(addCommentThunk.pending, (state) => {
        state.commentLoading = true;
      })

      .addCase(addCommentThunk.fulfilled, (state, action) => {
        state.commentLoading = false;

        const { postId, comment } = action.payload;

        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = {
            totalComments: 0,
            comments: [],
          };
        }

        state.commentsByPost[postId].comments.unshift(comment);
        state.commentsByPost[postId].totalComments++;
      })

      .addCase(addCommentThunk.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      })

      .addCase(getCommentsThunk.fulfilled, (state, action) => {
        const postId = action.meta.arg;

        state.commentsByPost[postId] = {
          totalComments: action.payload.totalComments,
          comments: action.payload.comments,
        };
      })

      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments = state.commentsByPost[
            postId
          ].comments.filter((item) => item._id !== commentId);

          state.commentsByPost[postId].totalComments--;
        }
      })
      .addCase(likePostThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(likePostThunk.fulfilled, (state, action) => {
        state.loading = false;

        const postId = action.meta.arg;

        state.likesByPost[postId] = {
          totalLikes: action.payload.totalLikes,
          liked: action.payload.liked,
        };
      })

      .addCase(likePostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPosts } = postSlice.actions;

export default postSlice.reducer;
