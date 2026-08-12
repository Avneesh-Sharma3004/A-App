import api from "./api";

export const registerUser = async (data) => {
  const response = await api.post("api/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  console.log("Calling Login API...");
  const response = await api.post("/api/auth/login", data);
  console.log("API Response:", response.data);

  return response.data;
};
