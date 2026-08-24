const axios = require("axios");

const sendPushNotification = async ({ pushToken, title, body, data = {} }) => {
  if (!pushToken) {
    console.log("❌ No push token found");
    return;
  }

  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      {
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      },
      {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("📱 Push Notification Response =>", response.data);

    return response.data;
  } catch (error) {
    console.log(
      "❌ Push Notification Error =>",
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports = {
  sendPushNotification,
};
