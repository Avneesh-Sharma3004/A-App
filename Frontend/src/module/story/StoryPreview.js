import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import navigationServices from "../../navigator/navigationServices";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  createStoryThunk,
  getStoriesThunk,
} from "../../redux/slices/storyslice";
import { useTheme } from "../../theme/ThemeContext";

export default function StoryPreview() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { uploading } = useSelector((state) => state.story);
  const route = useRoute();

  const { media } = route.params;

  const player = useVideoPlayer(media.uri, (player) => {
    player.loop = true;
    player.play();
  });

  const handleShare = async () => {
    const formData = new FormData();

    formData.append("media", {
      uri: media.uri,
      name: media.fileName || `story.${media.type === "image" ? "jpg" : "mp4"}`,
      type:
        media.mimeType || (media.type === "image" ? "image/jpeg" : "video/mp4"),
    });

    const result = await dispatch(createStoryThunk(formData));

    if (createStoryThunk.fulfilled.match(result)) {
      await dispatch(getStoriesThunk());

      navigationServices.resetTo("BottomTabs");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Preview */}

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
          <Ionicons name="arrow-back" size={28} color={theme.colors.icon} />
        </Pressable>

        <Text style={styles.title}>Your Story</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Bottom Card */}

      <View
        style={[
          styles.bottomCard,
          { backgroundColor: theme.colors.background },
        ]}>
        <View style={styles.row}>
          <Ionicons name="globe-outline" size={22} color={theme.colors.icon} />

          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.heading, { color: theme.colors.text }]}>
              Your Story
            </Text>

            <Text style={[styles.subHeading, { color: theme.colors.text }]}>
              Anyone can view your story
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.shareButton}
          onPress={handleShare}
          disabled={uploading}>
          <Text style={styles.shareText}>
            {uploading ? "Uploading..." : "Share Story"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  header: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  heading: {
    fontSize: 17,
    fontWeight: "600",
  },

  subHeading: {
    color: "#666",
    marginTop: 2,
  },

  shareButton: {
    marginTop: 25,
    backgroundColor: "#1877F2",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  shareText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
