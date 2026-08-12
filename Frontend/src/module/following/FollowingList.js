import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingThunk } from "../../redux/slices/userslice";
import { useEffect } from "react";

export default function FollowingList() {
  const { theme } = useTheme();

  const dispatch = useDispatch();

  const { following, loading } = useSelector((state) => state.user);
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (profile?._id) {
      dispatch(getFollowingThunk(profile._id));
    }
  }, [profile]);

  console.log("Following:", following);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <FlatList
          data={following}
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
