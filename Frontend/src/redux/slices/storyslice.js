import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createStory,
  getStories,
  getStoryViewers,
  viewStory,
} from "../../services/storyapi";

const initialState = {
  stories: [],
  viewers: [],
  loading: false,
  uploading: false,
  error: null,
};

export const getStoriesThunk = createAsyncThunk(
  "story/getStories",
  async (_, thunkAPI) => {
    try {
      const response = await getStories();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stories",
      );
    }
  },
);

export const createStoryThunk = createAsyncThunk(
  "story/createStory",
  async (formData, thunkAPI) => {
    try {
      const response = await createStory(formData);
      // console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create story",
      );
    }
  },
);

export const viewStoryThunk = createAsyncThunk(
  "story/viewStory",
  async (storyId, thunkAPI) => {
    try {
      const response = await viewStory(storyId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to view story",
      );
    }
  },
);

export const getStoryViewersThunk = createAsyncThunk(
  "story/getStoryViewers",
  async (storyId, thunkAPI) => {
    try {
      const response = await getStoryViewers(storyId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch viewers",
      );
    }
  },
);

const storySlice = createSlice({
  name: "story",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get Stories
      .addCase(getStoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getStoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.data;
      })

      .addCase(getStoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Story
      .addCase(createStoryThunk.pending, (state) => {
        state.uploading = true;
      })

      .addCase(createStoryThunk.fulfilled, (state) => {
        state.uploading = false;
      })

      .addCase(createStoryThunk.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // View Story
      .addCase(viewStoryThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;

        const story = state.stories.find((item) => item._id === id);

        if (story) {
          story.viewed = true;
        }
      })

      // Story Viewers
      .addCase(getStoryViewersThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(getStoryViewersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.viewers = action.payload.viewers;
      })

      .addCase(getStoryViewersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storySlice.reducer;
