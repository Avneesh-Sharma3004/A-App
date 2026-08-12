import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PostImage from "../../components/PostImages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authslice";
import { getProfileThunk } from "../../redux/slices/profileSlice";
import { useEffect } from "react";
import { useTheme } from "../../theme/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Ionicons";
import navigationServices from "../../navigator/navigationServices";

export default function Profile() {
  const { theme, toggleTheme, isDark } = useTheme();

  const images = [
    require("../../../assets/TabIcon/Home.png"),
    require("../../../assets/TabIcon/Home.png"),
    require("../../../assets/TabIcon/Home.png"),
  ];
  const dispatch = useDispatch();

  const { profile, posts, postCount, followers, following, loading } =
    useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top"]}>
      <View style={styles.menuicon}>
        <Pressable onPress={() => navigationServices.navigate("HamBurgerMenu")}>
          <Ionicons name="menu-outline" size={30} color={theme.colors.icon} />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 15,
          paddingTop: 10,
        }}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.avtar}></View>
          <View style={{ alignSelf: "center", marginLeft: 20 }}>
            <Text style={{ color: theme.colors.text }}>{profile?.name}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 50,
                marginTop: 5,
              }}>
              <View>
                <Text style={{ color: theme.colors.text }}>Post</Text>
                <Text style={{ color: theme.colors.text }}>{postCount}</Text>
              </View>
              <Pressable
                onPress={() => navigationServices.navigate("FollowersList")}>
                <Text style={{ color: theme.colors.text }}>Followers</Text>
                <Text style={{ color: theme.colors.text }}>{followers}</Text>
              </Pressable>
              <Pressable
                onPress={() => navigationServices.navigate("FollowingList")}>
                <Text style={{ color: theme.colors.text }}>Following</Text>
                <Text style={{ color: theme.colors.text }}>{following}</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 40 }}>
          <Text style={{ color: theme.colors.text }}>Posts</Text>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          renderItem={({ item }) => <PostImage image={item.image} />}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avtar: {
    height: 100,
    width: 100,
    backgroundColor: "#776e6e",
    borderRadius: 50,
  },
  postImage: {
    height: 200,
    width: 150,
    backgroundColor: "#776e6e",
    marginTop: 10,
  },
  button: {
    alignItems: "center",
    marginBottom: 10,
  },
  menuicon: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
