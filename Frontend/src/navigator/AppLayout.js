import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import AppNavigationContainer from "./NavigationContainer";

export default function AppLayout() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <AppNavigationContainer />
    </SafeAreaView>
  );
}
