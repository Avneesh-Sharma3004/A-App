// src/navigation/NavigationContainer.js

import React from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";

import { navigationRef, isReadyRef } from "./navigationServices";
import RootNavigator from "./rootNavigator"

export default function AppNavigationContainer() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={() => {}}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}