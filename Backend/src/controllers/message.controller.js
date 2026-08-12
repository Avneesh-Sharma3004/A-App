const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const userModel = require("../models/user.model");
const { getIO } = require("../socket");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    // Validation
    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    // Khud ko message nahi bhej sakte
    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send message to yourself",
      });
    }

    // Receiver exist karta hai ya nahi
    const receiver = await userModel.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    // Existing conversation find karo
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    // Conversation nahi hai to create karo
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Message create
    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    });

    // Last message update
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // Sender/receiver details populate
    await newMessage.populate([
      {
        path: "sender",
        select: "name profileImage",
      },
      {
        path: "receiver",
        select: "name profileImage",
      },
    ]);

    // 🔥 Socket.IO
    const io = getIO();

    io.to(receiverId).emit("newMessage", newMessage);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    // Check receiver/user exists
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find conversation between current user and selected user
    const conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, userId],
      },
    });

    // Abhi tak koi conversation nahi hai
    if (!conversation) {
      return res.status(200).json({
        success: true,
        conversation: null,
        totalMessages: 0,
        messages: [],
      });
    }

    // Get all messages
    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation: conversation._id,
      totalMessages: messages.length,
      messages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    // Check user exists
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current user aur selected user ki conversation find karo
    const conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, userId],
      },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        message: "No conversation found",
        modifiedCount: 0,
      });
    }

    const readAt = new Date();

    // Sirf selected user ke unread messages ko read karo
    const result = await Message.updateMany(
      {
        conversation: conversation._id,
        sender: userId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt,
        },
      },
    );

    // 🔥 Sirf tab socket event bhejo jab actual messages read hue
    if (result.modifiedCount > 0) {
      const io = getIO();

      io.to(userId).emit("messagesRead", {
        conversationId: conversation._id,
        senderId: userId,
        readBy: currentUserId,
        readAt,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
};
