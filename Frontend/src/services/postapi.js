import api from "./api";

export const getpost = async () => {
  const response = await api.get("/posts/get-posts");

  // console.log(response);
  return response.data.data;
};

export const createPost = async (formData) => {
  const response = await api.post("/posts/create-post", formData);

  return response.data.data;
};

export const deletePost = async () => {
  const response = await api.delete(`posts/delete-post/${id}`);
  return response.data.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);

  return response.data;
};
export const getPostLikes = async (postId) => {
  const response = await api.get(`/posts/${postId}/like`);

  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, {
    text,
  });

  return {
    postId,
    comment: response.data.comment,
  };
};

export const getComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);

  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  await api.delete(`/posts/comments/${commentId}`);

  return {
    postId,
    commentId,
  };
};
