import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  // Physical device check
  if (!Device.isDevice) {
    console.log("Push notification ke liye physical device chahiye");
    return null;
  }

  // =========================
  // ANDROID CHANNEL
  // =========================

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // =========================
  // PERMISSION
  // =========================

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Notification permission nahi mili");
    return null;
  }

  // =========================
  // PROJECT ID
  // =========================

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log("❌ EAS Project ID nahi mila");
    return null;
  }

  // =========================
  // EXPO PUSH TOKEN
  // =========================

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  // console.log("📱 Expo Push Token =>", token);

  return token;
};

export const setupNotificationListeners = ({ onNotificationTap }) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;

      console.log("🔔 Notification Tapped =>", data);

      if (onNotificationTap) {
        onNotificationTap(data);
      }
    },
  );

  return () => {
    subscription.remove();
  };
};
