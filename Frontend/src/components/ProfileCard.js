import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ProfileCard({ name, buttonTitle = "Follow", onPress }) {
  const { theme } = useTheme();

  // First + Last name initials
  const initials = name
    ?.trim()
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}>
        <Text style={styles.initialText}>{initials}</Text>
      </View>

      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.name,
          {
            color: theme.colors.text,
          },
        ]}>
        {name}
      </Text>

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        onPress={onPress}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  initialText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  name: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  button: {
    marginTop: 14,
    width: "100%",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
