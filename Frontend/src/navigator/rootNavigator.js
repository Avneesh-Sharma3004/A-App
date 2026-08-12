// // src/navigation/RootNavigator.js

// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import Home from "../module/home";
// import Post from "../module/post";
// import Login from "../module/auth/login";
// import RegisterScreen from "../module/auth/RegisterScreen";

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   return (
//     <Stack.Navigator
//       initialRouteName="Login"
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Post" component={Post} />
//       <Stack.Screen
//         name="RegisterScreen"
//         component={RegisterScreen}
//         options={{
//           headerShown: true,
//           title: "",
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

import React from "react";
import AuthStack from "./stack/AuthStack";
import AppStack from "./stack/AppStack";
import { useSelector } from "react-redux";

export default function RootNavigator() {
  const token = useSelector((state) => state.auth.token);

  return token ? <AppStack /> : <AuthStack />;
}
