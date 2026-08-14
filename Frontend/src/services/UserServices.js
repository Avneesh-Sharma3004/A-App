import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export const savePushToken = async (pushToken) => {
  const response = await api.post(`/api/users/push-token`, {
    pushToken,
  });

  return response.data;
};
