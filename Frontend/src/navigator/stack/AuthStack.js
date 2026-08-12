import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../../module/auth/login";
import RegisterScreen from "../../module/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
