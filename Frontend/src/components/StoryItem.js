import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function StoryItem({ item, onPress }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => onPress?.(item)}>
      <View style={styles.gradientBorder}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      </View>

      <Text
        numberOfLines={1}
        style={[styles.name, { color: theme.colors.text }]}>
        {item.name}
      </Text>

      {item.type === "video" && (
        <View style={styles.videoBadge}>
          <Text style={styles.videoText}>▶</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    alignItems: "center",
    marginRight: 12,
  },

  gradientBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3,
    borderWidth: 2.5,
    borderColor: "#ff0066",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },

  name: {
    marginTop: 6,
    fontSize: 12,
    width: 70,
    textAlign: "center",
  },

  videoBadge: {
    position: "absolute",
    bottom: 18,
    right: 10,
    backgroundColor: "#000",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  videoText: {
    color: "#fff",
    fontSize: 9,
  },
});
