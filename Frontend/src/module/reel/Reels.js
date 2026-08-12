import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { getReels } from "../../services/PexelsService";
import ReelItem from "../../components/ReelItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";

const { height } = Dimensions.get("window");

export default function Reels() {
  const { theme } = useTheme();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await getReels();
    setVideos(data);
  };

  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  if (videos.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.colors.background }}
      edges={["top"]}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={currentIndex === index} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
