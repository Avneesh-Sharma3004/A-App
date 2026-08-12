let io;

const onlineUsers = new Map();

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // =========================
    // JOIN USER
    // =========================
    socket.on("joinUser", (userId) => {
      if (!userId) {
        return;
      }

      socket.userId = userId;

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      socket.join(userId);

      console.log(`User ${userId} is online`);
      console.log(`User ${userId} sockets:`, [...onlineUsers.get(userId)]);

      if (onlineUsers.get(userId).size === 1) {
        io.emit("userOnline", {
          userId,
        });
      }
    });

    // Initial online status check
    socket.on("checkUserOnline", (targetUserId) => {
      if (!targetUserId) {
        return;
      }

      const isOnline = onlineUsers.has(targetUserId);

      socket.emit("userOnlineStatus", {
        userId: targetUserId,
        isOnline,
      });
    });

    // =========================
    // TYPING
    // =========================
    socket.on("typing", ({ receiverId }) => {
      if (!socket.userId || !receiverId) {
        return;
      }

      socket.to(receiverId).emit("userTyping", {
        userId: socket.userId,
      });
    });

    // =========================
    // STOP TYPING
    // =========================
    socket.on("stopTyping", ({ receiverId }) => {
      if (!socket.userId || !receiverId) {
        return;
      }

      socket.to(receiverId).emit("userStoppedTyping", {
        userId: socket.userId,
      });
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      const userId = socket.userId;

      if (!userId) {
        console.log("Socket disconnected:", socket.id);
        return;
      }

      const userSockets = onlineUsers.get(userId);

      if (!userSockets) {
        console.log("Socket disconnected:", socket.id);
        return;
      }

      // Current socket remove
      userSockets.delete(socket.id);

      console.log(`Socket ${socket.id} disconnected for user ${userId}`);

      // Agar user ke aur devices/sockets connected hain
      if (userSockets.size > 0) {
        console.log(`User ${userId} is still online`);

        return;
      }

      // Koi socket nahi bacha
      onlineUsers.delete(userId);

      console.log(`User ${userId} is offline`);

      io.emit("userOffline", {
        userId,
      });

      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
  onlineUsers,
};
