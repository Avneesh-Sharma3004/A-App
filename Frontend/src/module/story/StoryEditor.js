import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import navigationServices from "../../navigator/navigationServices";
import { VideoView, useVideoPlayer } from "expo-video";
import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";

export default function StoryEditor() {
  const { theme } = useTheme();
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [storyText, setStoryText] = useState("");
  const route = useRoute();

  const { media } = route.params;

  const player = useVideoPlayer(media.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Media */}

      {media.type === "image" ? (
        <Image
          source={{ uri: media.uri }}
          style={styles.media}
          resizeMode="contain"
        />
      ) : (
        <VideoView
          style={styles.media}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      )}

      {/* Header */}

      <View style={styles.header}>
        <Pressable onPress={() => navigationServices.goBack()}>
          <Ionicons name="close" size={30} color={theme.colors.icon} />
        </Pressable>

        <Pressable
          onPress={() => {
            navigationServices.navigate("StoryPreview", { media });
          }}>
          <Ionicons name="arrow-forward" size={28} color={theme.colors.icon} />
        </Pressable>
      </View>

      {/* Bottom Toolbar */}

      <View style={styles.toolbar}>
        <Pressable onPress={() => setShowTextEditor(true)}>
          <Ionicons name="text" size={28} color={theme.colors.icon} />
        </Pressable>
        <Ionicons name="happy-outline" size={26} color={theme.colors.icon} />

        <Ionicons name="brush-outline" size={26} color={theme.colors.icon} />

        <Ionicons name="crop-outline" size={26} color={theme.colors.icon} />

        <Ionicons
          name="ellipsis-horizontal"
          size={26}
          color={theme.colors.icon}
        />
      </View>

      <Modal visible={showTextEditor} animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{
            flex: 1,
            backgroundColor: "#000",
          }}>
          {/* Header */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 60,
            }}>
            <Pressable onPress={() => setShowTextEditor(false)}>
              <Ionicons name="close" size={30} color={theme.colors.icon} />
            </Pressable>

            <Pressable
              onPress={() => {
                setShowTextEditor(false);
              }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                }}>
                Done
              </Text>
            </Pressable>
          </View>

          {/* Text */}

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}>
            <TextInput
              value={storyText}
              onChangeText={setStoryText}
              autoFocus
              multiline
              placeholder="Type something..."
              placeholderTextColor="#777"
              style={{
                color: "#fff",
                fontSize: 42,
                fontWeight: "700",
                textAlign: "center",
                width: "100%",
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {storyText.trim() !== "" && (
        <View
          style={{
            position: "absolute",
            top: "45%",
            alignSelf: "center",
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: "#000",
              fontSize: 36,
              fontWeight: "700",
              textAlign: "center",
            }}>
            {storyText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  header: {
    position: "absolute",
    top: 55,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  toolbar: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
