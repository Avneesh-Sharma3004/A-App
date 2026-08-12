import axios from "axios";

const API_KEY = "yp6jfUXRICdhekDtcAEqBfoAP462HOJBWVln0q0qgLWNiHiS1HfnGMwT";

const api = axios.create({
  baseURL: "https://api.pexels.com/videos",
  headers: {
    Authorization: API_KEY,
  },
});

// Ek category ki videos lane ke liye
const fetchCategory = async (query, page = 1) => {
  const response = await api.get("/search", {
    params: {
      query,
      page,
      per_page: 10,
    },
  });

  return response.data.videos;
};

// Nature + Cricket + Car
export const getReels = async (page = 1) => {
  try {
    const random = () => Math.floor(Math.random() * 20) + 1;

    const [nature, cricket, car] = await Promise.all([
      fetchCategory("nature", random()),
      fetchCategory("cricket", random()),
      fetchCategory("car", random()),
    ]);

    const videos = [...nature, ...cricket, ...car];

    return videos;
  } catch (error) {
    console.log(error.response?.data || error.message);
    return [];
  }
};
