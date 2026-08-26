import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://a-app-17oj.onrender.com",
  // baseURL: "http://192.168.1.235:1800",
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    // console.log(token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
