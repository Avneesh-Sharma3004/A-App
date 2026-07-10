// src/navigation/RootNavigator.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Home from "../module/home";
import Post from "../module/post"
import Login from "../module/auth/login";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
      name="Post"
      component={Post}/>

      
      
    </Stack.Navigator>
  );
}