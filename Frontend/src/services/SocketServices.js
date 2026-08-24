import { io } from "socket.io-client";
import { store } from "../redux/store";

import {
  setOnlineUsers,
  userOnline,
  userOffline,
  setUserOnlineStatus,
} from "../redux/slices/presenceSlice";

const SOCKET_URL = "https://a-app-17oj.onrender.com";
// const SOCKET_URL = "http://192.168.1.15:1800";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

let listenersAdded = false;
let currentUserId = null;

export const connectSocket = (userId) => {
  if (!userId) return;

  currentUserId = userId;

  // =========================
  // LISTENERS ONLY ONCE
  // =========================

  if (!listenersAdded) {
    listenersAdded = true;

    // =========================
    // SOCKET CONNECTED
    // =========================

    socket.on("connect", () => {
      console.log("🟢 Socket Connected =>", socket.id);

      // User ko apne room mein join karao
      socket.emit("joinUser", currentUserId);

      // Initial online users
      socket.emit("getOnlineUsers");
    });

    // =========================
    // INITIAL ONLINE USERS
    // =========================

    socket.on("onlineUsers", ({ users }) => {
      console.log("📋 Initial Online Users =>", users);

      store.dispatch(setOnlineUsers(users));
    });

    // =========================
    // USER ONLINE
    // =========================

    socket.on("userOnline", ({ userId }) => {
      console.log("🟢 User Online =>", userId);

      store.dispatch(userOnline(userId));
    });

    // =========================
    // USER OFFLINE
    // =========================

    socket.on("userOffline", ({ userId }) => {
      console.log("🔴 User Offline =>", userId);

      store.dispatch(userOffline(userId));
    });

    // =========================
    // SOCKET DISCONNECT
    // =========================

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket Disconnected =>", reason);
    });

    socket.on("userOnlineStatus", ({ userId, isOnline }) => {
      console.log("📡 User Online Status =>", userId, isOnline);

      store.dispatch(
        setUserOnlineStatus({
          userId,
          isOnline,
        }),
      );
    });
  }

  // Socket connect
  if (!socket.connected) {
    socket.connect();
  } else {
    // Agar already connected hai
    // to current user ko dobara join kara sakte hain
    socket.emit("joinUser", userId);
    socket.emit("getOnlineUsers");
  }
};

// =========================
// DISCONNECT
// =========================

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// =========================
// TYPING
// =========================

export const sendTyping = (receiverId) => {
  if (!socket.connected) return;

  socket.emit("typing", {
    receiverId,
  });
};

// =========================
// STOP TYPING
// =========================

export const stopTyping = (receiverId) => {
  if (!socket.connected) return;

  socket.emit("stopTyping", {
    receiverId,
  });
};

export const checkUserOnline = (userId) => {
  if (!socket.connected || !userId) return;

  socket.emit("checkUserOnline", userId);
};
