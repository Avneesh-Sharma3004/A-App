import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/slices/authslice";
import navigationServices from "../../navigator/navigationServices";
import { getProfileThunk } from "../../redux/slices/profileSlice";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      await dispatch(
        loginThunk({
          email,
          password,
        }),
      ).unwrap();

      await dispatch(getProfileThunk());

      console.log("Login Success");
    } catch (error) {
      console.log("Login Failed", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#fff",
          }}>
          <View style={{ marginBottom: 10, alignSelf: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>A-App</Text>
          </View>
          <View
            style={{
              backgroundColor: "#f2eded",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              gap: 20,
              marginHorizontal: 10,
              borderRadius: 5,
              elevation: 5,
              shadowColor: "#000",
            }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Welcome Back
              </Text>
            </View>
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
                  borderRadius: 5,
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
                  borderRadius: 5,
                }}
              />

              <Pressable
                onPress={handleLogin}
                style={{
                  backgroundColor: "red",
                  paddingVertical: 15,
                  alignItems: "center",
                  borderRadius: 5,
                }}>
                <Text style={{ color: "#fff" }}>Login</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text>Don't have an account</Text>
              <Pressable
                onPress={() => navigationServices.navigate("Register")}>
                <Text style={{ color: "#063640" }}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
