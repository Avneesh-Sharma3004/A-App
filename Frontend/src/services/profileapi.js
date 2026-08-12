import api from "./api";

export const getProfileDetails = async () => {
  const response = await api.get("api/users/profile");
  // console.log(response);
  return response.data;
};
