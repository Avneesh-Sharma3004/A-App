import api from "./api";

// Send message
export const sendMessage = async (receiverId, message) => {
  const response = await api.post("/api/messages/send", {
    receiverId,
    message,
  });

  return response.data;
};

// Get conversation messages
export const getConversationMessages = async (userId) => {
  const response = await api.get(`/api/messages/${userId}`);

  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (userId) => {
  const response = await api.patch(`/api/messages/${userId}/read`);

  return response.data;
};
