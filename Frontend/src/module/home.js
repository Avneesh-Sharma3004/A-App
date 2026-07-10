import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import FlotingButton from "../components/flotingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/postslice";
import navigationServices from "../navigator/navigationServices";

export default function Home() {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const onRefresh = () => {
    dispatch(fetchPosts());
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={["black"]} // Android
              tintColor="red" // iOS
            />
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#dddada",
                marginVertical: 10,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                }}
                resizeMode="cover"
              />

              <View
                style={{
                  padding: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.caption}>{item.caption}</Text>
                <Pressable>
                  <Text
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    :
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
        <FlotingButton onPress={() => navigationServices.navigate("Post")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    height: 200,
  },
  caption: {
    fontSize: 18,
    fontWeight: "500",
  },
});
