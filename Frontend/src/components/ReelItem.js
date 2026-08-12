import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

const { width, height } = Dimensions.get("window");

export default function ReelItem({ item, isActive }) {
  const videoUrl =
    item.video_files.find((v) => v.quality === "hd")?.link ||
    item.video_files[0]?.link;

  const player = useVideoPlayer(videoUrl);

  useEffect(() => {
    if (!player) return;

    player.loop = true;

    if (isActive) {
      player.currentTime = 0; // optional, first time se play
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="cover"
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width,
    height,
    backgroundColor: "#000",
  },
});
