import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import StoryItem from "./StoryItem";

export default function StoryList({ stories, onStoryPress }) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={stories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <StoryItem item={item} onPress={onStoryPress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: ,
  },
});
