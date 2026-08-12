import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../theme/ThemeContext";
import {
  followUserThunk,
  getAllUsersThunk,
  unfollowUserThunk,
} from "../redux/slices/userslice";

export default function PostItem({ item, onLike, onComment }) {
  const dispatch = useDispatch();
  const { theme, toggleTheme, isDark } = useTheme();

  const scale = useRef(new Animated.Value(1)).current;

  const { profile } = useSelector((state) => state.profile);
  const { users } = useSelector((state) => state.user);

  const postUser =
    users.find((u) => u._id === item.user) ||
    (profile?._id === item.user ? profile : null);
  const likesData = useSelector((state) => state.post.likesByPost[item._id]);

  const commentsData = useSelector(
    (state) => state.post.commentsByPost[item._id],
  );

  // ❤️ Current user liked?
  const liked =
    likesData?.likes?.some((user) => user._id === profile?._id) ?? false;

  // ❤️ Total Likes
  const totalLikes = likesData?.totalLikes ?? item.likes?.length ?? 0;

  // 💬 Total Comments
  const totalComments =
    commentsData?.totalComments ?? item.comments?.length ?? 0;

  // Instagram style text
  const firstUser = likesData?.likes?.[0];

  const likeText =
    totalLikes === 0
      ? "Be the first to like"
      : totalLikes === 1
        ? `Liked by ${firstUser?.name}`
        : `Liked by ${firstUser?.name} and ${totalLikes - 1} others`;

  const handleLike = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onLike?.(item);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}>
        {postUser?.profileImage ? (
          <Image
            source={{ uri: postUser.profileImage }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 22.5,
            }}
          />
        ) : (
          <View
            style={{
              width: 45,
              height: 45,
              borderRadius: 22.5,
              backgroundColor: "#8E44AD",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}>
              {postUser?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text
          style={{
            flex: 1,
            marginLeft: 12,
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: "600",
          }}>
          {postUser?.name || "Unknown User"}
        </Text>

        {postUser?._id !== profile?._id && (
          <Pressable
            onPress={async () => {
              if (postUser?.isFollowed) {
                await dispatch(unfollowUserThunk(postUser._id));
              } else {
                await dispatch(followUserThunk(postUser._id));
              }

              dispatch(getAllUsersThunk());
            }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: postUser?.isFollowed ? "#ddd" : "#1877F2",
            }}>
            <Text
              style={{
                color: postUser?.isFollowed ? "#000" : "#fff",
                fontWeight: "600",
              }}>
              {postUser?.isFollowed ? "Unfollow" : "Follow"}
            </Text>
          </Pressable>
        )}
      </View>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.actionContainer}>
          {/* Like */}
          <TouchableOpacity
            style={styles.iconRow}
            activeOpacity={0.7}
            onPress={handleLike}>
            <Animated.View
              style={{
                transform: [{ scale }],
              }}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={30}
                color={liked ? "#ff3040" : "#000"}
              />
            </Animated.View>

            <Text style={[styles.count, { color: theme.colors.text }]}>
              {totalLikes}
            </Text>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity
            style={styles.iconRow}
            activeOpacity={0.7}
            onPress={() => onComment?.(item)}>
            <Ionicons
              name="chatbubble-outline"
              size={26}
              color={theme.colors.icon}
            />

            <Text style={[styles.count, { color: theme.colors.text }]}>
              {totalComments}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instagram Like Text */}
        <Text
          style={[
            styles.likeText,
            {
              color: theme.colors.text,
            },
          ]}>
          {likeText}
        </Text>

        <Text
          style={[
            styles.caption,
            {
              color: theme.colors.text,
            },
          ]}>
          {item.caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },

  content: {
    padding: 12,
  },

  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    marginBottom: 8,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  count: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },

  likeText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  caption: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
});
