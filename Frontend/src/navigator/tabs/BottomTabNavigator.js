import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../../module/home";
import Profile from "../../module/Profile/Profile";
// import Settings from "../../module/settings";

import CustomTabBar from "./CustomTabBar";
import Post from "../../module/createPost/CreatePost";
import { SafeAreaView } from "react-native-safe-area-context";
import Reels from "../../module/reel/Reels";
import { useTheme } from "../../theme/ThemeContext";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["bottom"]}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            icon: require("../../../assets/TabIcon/Home.png"),
          }}
        />

        <Tab.Screen
          name="CreatePost"
          component={Post}
          options={{
            tabBarLabel: "CreatePost",
            icon: require("../../../assets/TabIcon/CreatePost.png"),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            icon: require("../../../assets/TabIcon/Profile.png"),
          }}
        />
        <Tab.Screen
          name="Reels"
          component={Reels}
          options={{
            tabBarLabel: "Reels",
            icon: require("../../../assets/TabIcon/Reels.png"),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
