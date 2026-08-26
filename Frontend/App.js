import { StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import { store } from "./src/redux/store";
import AppNavigationContainer from "./src/navigator";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { useEffect } from "react";
import { connectSocket } from "./src/services/SocketServices";
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from "./src/services/NotificationServices";
import { savePushToken } from "./src/services/UserServices";
import api from "./src/services/api";
import navigationServices from "./src/navigator/navigationServices";

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const { profile } = useSelector((state) => state.profile);

  const currentUserId = profile?._id;

  useEffect(() => {
    if (!currentUserId) return;

    connectSocket(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const setupPushNotification = async () => {
      try {
        const pushToken = await registerForPushNotificationsAsync();

        if (!pushToken) {
          // console.log("❌ Push token nahi mila");
          return;
        }

        // console.log("🚀 PUSH TOKEN =>", pushToken);

        const response = await savePushToken(pushToken);

        // console.log("✅ Push Token Saved =>", response);
      } catch (error) {
        // console.log(
        //   "❌ Push Token Save Error =>",
        //   error?.response?.data || error.message,
        // );
      }
    };

    const removeNotificationListener = setupNotificationListeners({
      onNotificationTap: async (data) => {
        // console.log("📲 Notification Data =>", data);

        if (data?.type === "message") {
          try {
            const response = await api.get(`api/users/profile`);

            const user = response.data?.user;

            if (!user) {
              // console.log("❌ Notification user nahi mila");
              return;
            }

            navigationServices.navigate("ChatScreen", {
              item: user,
            });
          } catch (error) {
            // console.log(
            //   "❌ Notification Navigation Error =>",
            //   error?.response?.data || error.message,
            // );
          }
        }
      },
    });

    setupPushNotification();

    // 🔥 Cleanup
    return () => {
      removeNotificationListener?.();
    };
  }, [currentUserId]);
  return (
    <ThemeProvider>
      <AppNavigationContainer />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});
