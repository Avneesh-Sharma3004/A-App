import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
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
import { useTheme } from "../../theme/ThemeContext";

export default function Login() {
  const { theme, isDark } = useTheme();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      setLoading(true);

      await dispatch(
        loginThunk({
          email,
          password,
        }),
      ).unwrap();

      await dispatch(getProfileThunk()).unwrap();

      console.log("Login Success");
    } catch (error) {
      console.log("Login Failed", error);

      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: theme.colors.background,
          }}>
          <View style={{ marginBottom: 10, alignSelf: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: theme.colors.text,
              }}>
              A-App
            </Text>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.card,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              gap: 20,
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: 5,
              shadowColor: "#000",
            }}>
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: theme.colors.text,
                }}>
                Welcome Back
              </Text>
            </View>
            <View style={{ width: "90%" }}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setemail}
                placeholderTextColor={theme.colors.text}
                style={{
                  borderWidth: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.text,
                }}
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={theme.colors.text}
                style={{
                  borderWidth: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.text,
                }}
              />

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "red" : "red",
                  paddingVertical: 15,
                  alignItems: "center",
                  borderRadius: 5,
                }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Login</Text>
                )}
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ color: theme.colors.text }}>
                Don't have an account
              </Text>
              <Pressable
                onPress={() => navigationServices.navigate("Register")}>
                <Text style={{ color: "#16caee" }}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
