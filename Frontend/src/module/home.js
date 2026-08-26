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
  StatusBar,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import FlotingButton from "../components/flotingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  getPostLikesThunk,
  likePostThunk,
  getCommentsThunk,
  addCommentThunk,
} from "../redux/slices/postslice";

import { getStoriesThunk } from "../redux/slices/storyslice";
import navigationServices from "../navigator/navigationServices";
import StoryList from "../components/StoryList";
import PostItem from "../components/PostsItems";
import CommentsModal from "../components/CommentModal";
import { useTheme } from "../theme/ThemeContext";
import ProfileCard from "../components/ProfileCard";
import {
  followUserThunk,
  getAllUsersThunk,
  unfollowUserThunk,
} from "../redux/slices/userslice";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function Home() {
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch();
  const [commentVisible, setCommentVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleUsers, setVisibleUsers] = useState(5);

  const { posts, loading, error } = useSelector((state) => state.post);
  const { stories, loading: storyLoading } = useSelector(
    (state) => state.story,
  );
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(getStoriesThunk());
    dispatch(getAllUsersThunk());
  }, []);

  const onRefresh = () => {
    dispatch(fetchPosts());
    dispatch(getStoriesThunk());
  };

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(getPostLikesThunk(post._id));
        dispatch(getCommentsThunk(post._id));
      });
    }
  }, [posts]);

  const formattedStories = stories.map((item) => ({
    id: item.user._id,
    user: item.user, // 👈 pura user object
    name: item.user._id === profile?._id ? "Your Story" : item.user.name,
    isMyStory: item.user._id === profile?._id,
    thumbnail: item.stories[0]?.media,
    type: item.stories[0]?.type,
    storyId: item.stories[0]?._id,
    viewed: item.stories[0]?.isViewed,
    stories: item.stories,
  }));

  const sortedStories = [
    ...formattedStories.filter((item) => item.isMyStory),
    ...formattedStories.filter((item) => !item.isMyStory),
  ];

  const unfollowedUsers = users.filter(
    (item) => !item.isFollowed && item._id !== profile?._id,
  );

  const visibleUserList = unfollowedUsers.slice(0, visibleUsers);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top"]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={["black"]}
              tintColor="red"
            />
          }
          ListHeaderComponent={
            <>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 5,
                  gap: 10,
                  flexDirection: "row",
                }}>
                <Pressable
                  onPress={() => navigationServices.navigate("Search")}>
                  <Ionicons
                    name="search-outline"
                    size={28}
                    color={theme.colors.icon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => navigationServices.navigate("ChatPersons")}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={28}
                    color={theme.colors.icon}
                  />
                </Pressable>
              </View>
              <StoryList
                stories={sortedStories}
                onStoryPress={(story) => {
                  navigationServices.navigate("StoryViewer", { story });
                }}
              />

              <FlatList
                data={visibleUserList}
                horizontal
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  gap: 10,
                }}
                renderItem={({ item }) => (
                  <ProfileCard
                    name={item.name}
                    OnProfilePress={() =>
                      navigationServices.navigate("OtherProfile", {
                        userId: item._id,
                      })
                    }
                    buttonTitle="Follow"
                    onPress={async () => {
                      try {
                        await dispatch(followUserThunk(item._id)).unwrap();

                        await dispatch(getAllUsersThunk()).unwrap();
                      } catch (error) {
                        console.log("Follow Error =>", error);
                      }
                    }}
                  />
                )}
                ListFooterComponent={
                  visibleUsers < unfollowedUsers.length ? (
                    <Pressable
                      onPress={() => setVisibleUsers((prev) => prev + 5)}
                      style={{
                        width: 100,
                        height: 180,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 5,
                      }}>
                      <Text
                        style={{
                          color: theme.colors.text,
                          fontWeight: "600",
                        }}>
                        Show More
                      </Text>
                    </Pressable>
                  ) : null
                }
              />
            </>
          }
          renderItem={({ item }) => (
            <PostItem
              item={item}
              onLike={async (post) => {
                await dispatch(likePostThunk(post._id));
                dispatch(getPostLikesThunk(post._id));
              }}
              onComment={(post) => {
                setSelectedPost(post);
                setCommentVisible(true);
                dispatch(getCommentsThunk(post._id));
              }}
            />
          )}
        />
        <FlotingButton
          onPress={() => navigationServices.navigate("AddStory")}
        />
        <CommentsModal
          visible={commentVisible}
          onClose={() => setCommentVisible(false)}
          postId={selectedPost?._id}
          comments={[]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 15,
  },
  image: {
    height: 200,
  },
  caption: {
    fontSize: 14,
    fontWeight: "500",
  },
  story: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderRadius: 50,
  },
  actions: {
    fontSize: 18,
  },
  profile: {
    height: 180,
    width: 120,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
