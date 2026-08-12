import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../theme/ThemeContext";
import { getFollowersThunk } from "../../redux/slices/userslice";
export default function FollowersList() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { followers, loading } = useSelector((state) => state.user);
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (profile?._id) {
      dispatch(getFollowersThunk(profile._id));
    }
  }, [profile]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <FlatList
          data={followers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.profileImage ? (
                <Image
                  source={{ uri: item.profileImage }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    {item.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <Text style={{ color: theme.colors.text, marginLeft: 12 }}>
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8E44AD",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
