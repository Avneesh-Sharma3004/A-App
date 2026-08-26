import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "../tabs/BottomTabNavigator";
import Post from "../../module/createPost/CreatePost";
import StoryViewer from "../../module/story/StoryViewer";
import AddStory from "../../module/story/AddStory";
import StoryEditor from "../../module/story/StoryEditor";
import StoryPreview from "../../module/story/StoryPreview";
import HamBurgerMenu from "../../module/Profile/HamBurgerMenu";
import FollowersList from "../../module/followers/FollowersList";
import FollowingList from "../../module/following/FollowingList";
import ChatPersons from "../../module/chat/ChatPersons";
import ChatScreen from "../../module/chat/ChatScreen";
import Search from "../../module/search/Search";
import OtherProfile from "../../module/Profile/OtherProfile";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />

      <Stack.Screen name="CreatePost" component={Post} />
      <Stack.Screen name="StoryViewer" component={StoryViewer} />
      <Stack.Screen name="AddStory" component={AddStory} />
      <Stack.Screen name="StoryEditor" component={StoryEditor} />
      <Stack.Screen name="StoryPreview" component={StoryPreview} />
      <Stack.Screen name="HamBurgerMenu" component={HamBurgerMenu} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
      <Stack.Screen name="FollowingList" component={FollowingList} />
      <Stack.Screen name="ChatPersons" component={ChatPersons} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
    </Stack.Navigator>
  );
}
