import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 10;
const NUM_COLUMNS = 3; // 3 images per row

const ITEM_WIDTH = (width - 30 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
// 30 = Profile ka paddingHorizontal (15 + 15)

export default function PostImage({ image }) {
  return (
    <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
  );
}

const styles = StyleSheet.create({
  image: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 10,
    borderWidth: 1,
  },
});
