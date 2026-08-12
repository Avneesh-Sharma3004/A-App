import api from "./api";

export const createStory = async (formData) => {
  const response = await api.post("/api/stories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getStories = async () => {
  const response = await api.get("api/stories");
  return response.data;
};

export const viewStory = async (storyId) => {
  const response = await api.post(`/api/stories/${storyId}/view`);
  return response.data;
};
export const getStoryViewers = async (storyId) => {
  const response = await api.get(`/api/stories/${storyId}/viewers`);
  return response.data;
};
