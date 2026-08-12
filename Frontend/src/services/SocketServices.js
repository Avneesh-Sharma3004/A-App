import { io } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.138:1800";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("joinUser", userId);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const sendTyping = (receiverId) => {
  socket.emit("typing", {
    receiverId,
  });
};

export const stopTyping = (receiverId) => {
  socket.emit("stopTyping", {
    receiverId,
  });
};
