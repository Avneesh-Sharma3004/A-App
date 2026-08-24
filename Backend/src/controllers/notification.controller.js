const User = require("../models/user.model");
const { sendPushNotification } = require("../services/notificationService");

const testNotification = async (req, res) => {
  try {
    console.log("REQ USER =>", req.user);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("USER PUSH TOKEN =>", user.pushToken);

    if (!user.pushToken) {
      return res.status(400).json({
        success: false,
        message: "Push token not found",
      });
    }

    const result = await sendPushNotification({
      pushToken: user.pushToken,
      title: "A-App 🔔",
      body: "Push notification successfully working!",
      data: {
        type: "test",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notification sent",
      result,
    });
  } catch (error) {
    console.log(
      "❌ Test Notification Error =>",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

module.exports = {
  testNotification,
};
