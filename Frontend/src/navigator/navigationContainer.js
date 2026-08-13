// src/navigation/NavigationContainer.js

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { navigationRef, isReadyRef } from "./navigationServices";
import RootNavigator from "./rootNavigator";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../redux/slices/authslice";
import { getProfileThunk } from "../redux/slices/profileSlice";
import SplashScreen from "../components/SplashScreen";

export default function AppNavigationContainer() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          dispatch(setToken(token));
          dispatch(getProfileThunk());
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return <SplashScreen />; // ya Splash Screen dikhao
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={() => {}}>
      <RootNavigator />
    </NavigationContainer>
  );
}
