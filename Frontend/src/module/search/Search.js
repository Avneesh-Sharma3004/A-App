import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { searchUsersThunk } from "../../redux/slices/userslice";
import navigationServices from "../../navigator/navigationServices";
import ChatPersonItem from "../../components/ChatPersonItem";

export default function Search() {
  const { theme } = useTheme();

  const dispatch = useDispatch();

  const { searchUsers, searchLoading } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  // Search users only when user types something
  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await dispatch(searchUsersThunk(search.trim())).unwrap();
      } catch (error) {
        console.log("Search Error =>", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 15,
        }}>
        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Ionicons name="search-outline" size={22} color={theme.colors.icon} />

          <TextInput
            placeholder="Search name..."
            placeholderTextColor={theme.colors.text}
            value={search}
            onChangeText={setSearch}
            autoFocus
            style={[
              styles.input,
              {
                color: theme.colors.text,
                marginLeft: 8,
              },
            ]}
          />
        </View>

        {/* Users */}
        {search.trim() ? (
          <FlatList
            data={searchUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ChatPersonItem
                name={item.name}
                profileImage={item.profileImage}
                onPress={() =>
                  navigationServices.navigate("OtherProfile", {
                    userId: item._id,
                  })
                }
              />
            )}
            ListEmptyComponent={
              !searchLoading ? (
                <Text
                  style={{
                    color: theme.colors.text,
                    textAlign: "center",
                    marginTop: 30,
                  }}>
                  No users found
                </Text>
              ) : null
            }
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  userItem: {
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 7,
  },
});
