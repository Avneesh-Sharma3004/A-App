import React from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ChatPersonItem({
  name,
  lastMessage,
  profileImage,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container]}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {name?.charAt(0)?.toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {
              color: theme.colors.text,
            },
          ]}
          numberOfLines={1}>
          {name}
        </Text>

        <Text
          style={[
            styles.message,
            {
              color: theme.colors.text,
              opacity: 0.6,
            },
          ]}
          numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8E44AD",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  info: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  message: {
    fontSize: 14,
    marginTop: 4,
  },
});
