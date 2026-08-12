import React from "react";
import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import navigationServices from "../../navigator/navigationServices";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export default function AddStory() {
  // Open Galory And permission function

  const openGallery = async () => {
    // Permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery permission.");
      return;
    }

    // Open Gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
      selectionLimit: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    console.log(asset);

    navigationServices.navigate("StoryEditor", {
      media: asset,
    });
  };
  ///////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigationServices.goBack()}>
          <Ionicons name="close" size={30} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>New Story</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Pressable style={styles.card} onPress={openGallery}>
          <Ionicons name="images" size={55} color="#000" />

          <Text style={styles.title}>Gallery</Text>

          <Text style={styles.subtitle}>Choose image or video</Text>
        </Pressable>

        <Pressable style={styles.card}>
          <Ionicons name="camera" size={55} color="#000" />

          <Text style={styles.title}>Camera</Text>

          <Text style={styles.subtitle}>Capture instantly</Text>
        </Pressable>
      </View>

      {/* Bottom */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>Images & Videos</Text>

        <Text style={styles.bottomText}>Max 15 Seconds</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },

  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 25,
  },

  card: {
    backgroundColor: "#dadadd",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 35,
  },

  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
  },

  subtitle: {
    color: "#000",
    marginTop: 8,
    fontSize: 15,
  },

  bottomBar: {
    borderTopWidth: 0.5,
    borderColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  bottomText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
