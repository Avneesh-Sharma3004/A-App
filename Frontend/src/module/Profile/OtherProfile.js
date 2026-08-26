import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PostImage from "../../components/PostImages";
import { useTheme } from "../../theme/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import navigationServices from "../../navigator/navigationServices";
import { useRoute } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { getOtherProfileThunk } from "../../redux/slices/profileSlice";
import {
  followUserThunk,
  unfollowUserThunk,
} from "../../redux/slices/userslice";

export default function OtherProfile() {
  const route = useRoute();

  const { userId } = route.params;
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { otherProfile, otherPosts, otherIsFollowed, otherProfileLoading } =
    useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getOtherProfileThunk(userId));
  }, [userId]);

  if (otherProfileLoading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        <ActivityIndicator size="large" color={theme.colors.icon} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={["top"]}>
      {/* Header */}

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Ionicons name="person" size={45} color="#fff" />
          </View>

          {/* Name + Stats */}
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.name,
                {
                  color: theme.colors.text,
                },
              ]}>
              {otherProfile?.name || "User"}
            </Text>

            <View style={styles.statsContainer}>
              {/* Posts */}
              <View style={styles.stat}>
                <Text
                  style={[
                    styles.statTitle,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  Posts
                </Text>

                <Text
                  style={[
                    styles.statCount,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  {otherPosts?.length || 0}
                </Text>
              </View>

              {/* Followers */}
              <Pressable
                style={styles.stat}
                // onPress={() =>
                //   navigationServices.navigate("FollowersList", {
                //     followers: otherProfile?.followers || [],
                //   })
                // }
              >
                <Text
                  style={[
                    styles.statTitle,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  Followers
                </Text>

                <Text
                  style={[
                    styles.statCount,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  {otherProfile?.followersCount || 0}
                </Text>
              </Pressable>

              {/* Following */}
              <Pressable
                style={styles.stat}
                // onPress={() =>
                //   navigationServices.navigate("FollowingList", {
                //     following: otherProfile?.following || [],
                //   })
                // }
              >
                <Text
                  style={[
                    styles.statTitle,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  Following
                </Text>

                <Text
                  style={[
                    styles.statCount,
                    {
                      color: theme.colors.text,
                    },
                  ]}>
                  {otherProfile?.followingCount || 0}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}>
          {/* Message */}
          <Pressable
            onPress={() =>
              navigationServices.navigate("ChatScreen", { item: otherProfile })
            }
            style={[
              styles.editButton,
              {
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={{
                color: theme.colors.text,
                fontWeight: "600",
              }}>
              Message
            </Text>
          </Pressable>

          {/* Follow / Unfollow */}
          <Pressable
            onPress={async () => {
              if (otherIsFollowed) {
                await dispatch(unfollowUserThunk(otherProfile._id));
              } else {
                await dispatch(followUserThunk(otherProfile._id));
              }

              await dispatch(getOtherProfileThunk(userId)).unwrap();
            }}
            style={[
              styles.editButton,
              {
                borderColor: theme.colors.border,

                // Follow ke liye different color
                backgroundColor: otherIsFollowed ? "transparent" : "#2196F3",
              },
            ]}>
            <Text
              style={{
                color: otherIsFollowed ? theme.colors.text : "#fff",
                fontWeight: "600",
              }}>
              {otherIsFollowed ? "Unfollow" : "Follow"}
            </Text>
          </Pressable>
        </View>

        {/* Posts Heading */}
        <View style={styles.postsHeader}>
          <Text
            style={[
              styles.postsTitle,
              {
                color: theme.colors.text,
              },
            ]}>
            Posts
          </Text>
        </View>

        {/* Posts Grid */}
        <FlatList
          data={otherPosts}
          keyExtractor={(item) => item._id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          renderItem={({ item }) => <PostImage image={item.image} />}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 10,
          }}
          ListEmptyComponent={
            <Text
              style={{
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 30,
              }}>
              No posts available
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  menuicon: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    height: 100,
    width: 100,
    backgroundColor: "#776e6e",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  stat: {
    alignItems: "center",
  },

  statTitle: {
    fontSize: 13,
  },

  statCount: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },

  editButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  postsHeader: {
    marginTop: 25,
  },

  postsTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});
