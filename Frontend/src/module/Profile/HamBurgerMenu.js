import React from "react";
import { StyleSheet, Text, View, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authslice";
import { useTheme } from "../../theme/ThemeContext";
import * as Application from "expo-application";

export default function HamBurgerMenu() {
  const { theme, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        Settings
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Dark Mode
          </Text>

          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      <Pressable
        style={[styles.logoutBtn, { backgroundColor: theme.colors.danger }]}
        onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text
          style={{
            color: theme.colors.text,
          }}>
          Version {Application.nativeApplicationVersion}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
  },

  card: {
    borderRadius: 15,
    borderWidth: 1,
    padding: 18,
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
  },

  logoutBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingBottom: 10,
  },
});
