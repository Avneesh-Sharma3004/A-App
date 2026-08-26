// import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
// import React from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "../../theme/ThemeContext";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import ChatPersonItem from "../../components/ChatPersonItem";
// import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { getAllUsersThunk } from "../../redux/slices/userslice";

// export default function ChatPersons() {
//   const dispatch = useDispatch();

//   const { users } = useSelector((state) => state.user);

//   const [search, setSearch] = useState("");
//   const { theme } = useTheme();

//   useEffect(() => {
//     dispatch(getAllUsersThunk());
//   }, []);

//   useEffect(() => {
//     dispatch(getAllUsersThunk(search));
//   }, [search]);
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
//       <View style={{ flex: 1, paddingHorizontal: 15 }}>
//         <View
//           style={[
//             styles.searchContainer,
//             {
//               backgroundColor: theme.colors.card,
//               borderColor: theme.colors.border,
//             },
//           ]}>
//           <Ionicons name="search-outline" size={22} color={theme.colors.icon} />

//           <TextInput
//             placeholder="Search name..."
//             placeholderTextColor={theme.colors.text}
//             value={search}
//             onChangeText={setSearch}
//             style={[
//               styles.input,
//               {
//                 color: theme.colors.text,
//                 marginLeft: 8,
//               },
//             ]}
//           />
//         </View>
//         <FlatList
//           data={users}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <ChatPersonItem
//               name={item.name}
//               profileImage={item.profileImage}
//               onPress={() => console.log(item)}
//             />
//           )}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: 48,
//     borderRadius: 12,
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     marginBottom: 20,
//   },

//   input: {
//     flex: 1,
//     fontSize: 16,
//   },

//   profileImage: {
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//     backgroundColor: "#fff",
//   },
// });

import { StyleSheet, Text, TextInput, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChatPersonItem from "../../components/ChatPersonItem";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "../../redux/slices/userslice";
import navigationServices from "../../navigator/navigationServices";

export default function ChatPersons() {
  const { theme } = useTheme();

  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");

  // Initial users load
  // useEffect(() => {
  //   dispatch(getAllUsersThunk());
  // }, [dispatch]);

  // Search with 500ms debounce

  useEffect(() => {
    if (!search.trim()) {
      dispatch(getAllUsersThunk());
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await dispatch(getAllUsersThunk(search.trim())).unwrap();
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
            onChangeText={(text) => {
              setSearch(text);
            }}
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
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChatPersonItem
              name={item.name}
              profileImage={item.profileImage}
              onPress={() =>
                navigationServices.navigate("ChatScreen", { item })
              }
            />
          )}
          ListEmptyComponent={
            !loading ? (
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
});
