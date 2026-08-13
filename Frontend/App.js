import { StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import { store } from "./src/redux/store";
import AppNavigationContainer from "./src/navigator";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { useEffect } from "react";
import { connectSocket } from "./src/services/SocketServices";

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

  return (
    <ThemeProvider>
      <AppNavigationContainer />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});
