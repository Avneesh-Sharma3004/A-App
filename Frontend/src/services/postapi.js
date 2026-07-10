import api from "./api";

export const getpost = async () => {
  const response = await api.get("/posts/get-posts");

  // console.log(response);
  return response.data.data;
};

export const createPost = async (formData) => {
  const response = await api.post("/create-post", formData);

  return response.data.data;
};
