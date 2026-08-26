import api from "./api";

export const getProfileDetails = async () => {
  const response = await api.get("api/users/profile");
  // console.log(response);
  return response.data;
};

export const getOtherProfileDetails = async (userId) => {
  const response = await api.get(`api/users/profile/${userId}`);
  // console.log(response);
  return response.data;
};
