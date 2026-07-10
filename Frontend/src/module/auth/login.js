import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/slices/authslice";
import navigationServices from "../../navigator/navigationServices";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const result = await dispatch(
      loginThunk({
        email,
        password,
      }),
    );

    console.log("Result:", result);

    if (loginThunk.fulfilled.match(result)) {
      console.log("Login Success");
      navigationServices.replace("Home");
    } else {
      console.log("Login Failed", result);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "90%" }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setemail}
            style={{
              borderWidth: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
          />

          <Pressable
            onPress={handleLogin}
            style={{
              backgroundColor: "red",
              paddingVertical: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
