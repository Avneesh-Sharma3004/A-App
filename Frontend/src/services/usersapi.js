import api from "./api";
export const getAllUsers = async (search = "") => {
  const response = await api.get(
    `/api/users/all?search=${encodeURIComponent(search)}`,
  );

  return response.data;
};
export const followUser = async (userId) => {
  const response = await api.post(`/api/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await api.post(`/api/users/${userId}/unfollow`);
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await api.get(`/api/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId) => {
  const response = await api.get(`/api/users/${userId}/following`);
  return response.data;
};
