import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Pressable } from "react-native";
import { Modal } from "react-native";

import {
  viewStoryThunk,
  getStoryViewersThunk,
} from "../../redux/slices/storyslice";
import { useEffect } from "react";
import navigationServices from "../../navigator/navigationServices";
import { formatTime } from "../../utils/Helper";

export default function StoryViewer() {
  const [showViewers, setShowViewers] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();

  const { viewers } = useSelector((state) => state.story);
  const { story } = route.params;

  const isMyStory = story.isMyStory;
  // console.log(story);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStory = story.stories[currentIndex];
  const nextStory = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigationServices.goBack();
    }
  };
  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleViewers = () => {
    dispatch(getStoryViewersThunk(currentStory._id));
    setShowViewers(true);
  };

  useEffect(() => {
    if (!currentStory?.isViewed) {
      dispatch(viewStoryThunk(currentStory._id));
    }
  }, [currentIndex]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {currentStory.type === "image" ? (
        <Image
          source={{ uri: currentStory.media }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="contain"
        />
      ) : // Video baad me
      null}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          flexDirection: "row",
        }}>
        <Pressable style={{ flex: 1 }} onPress={previousStory} />
        <Pressable style={{ flex: 1 }} onPress={nextStory} />
      </View>

      {/* <View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}>
          <Pressable onPress={handleViewers}>
            <Text style={{ color: "#fff", fontSize: 18 }}>👁 Viewers</Text>
          </Pressable>
        </View> */}
      {isMyStory && (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}>
          <Pressable onPress={handleViewers}>
            <Text style={{ color: "#fff" }}>👁 Viewers</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={showViewers}
        transparent
        animationType="slide"
        onRequestClose={() => setShowViewers(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
          onPress={() => setShowViewers(false)}>
          <Pressable
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "50%",
              padding: 20,
            }}
            onPress={() => {}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
              }}>
              Viewers
            </Text>

            {viewers.length === 0 ? (
              <Text>No viewers yet</Text>
            ) : (
              viewers.map((item, index) => (
                <View
                  key={index}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 0.5,
                    borderColor: "#ddd",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {formatTime(item.viewedAt)}
                  </Text>
                </View>
              ))
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
