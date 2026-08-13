import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerThunk } from "../../redux/slices/authslice";
import navigationServices from "../../navigator/navigationServices";
import { getProfileThunk } from "../../redux/slices/profileSlice";
import { useTheme } from "../../theme/ThemeContext";

export default function RegisterScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const handleRegister = async () => {
    const result = await dispatch(
      registerThunk({
        name,
        email,
        password,
      }),
    );

    console.log("Result:", result);
    await dispatch(getProfileThunk());

    if (registerThunk.fulfilled.match(result)) {
      console.log("Register Success");
    } else {
      console.log("register Failed", result);
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
      }}>
      <View
        style={{
          backgroundColor: theme.colors.background,
          paddingVertical: 40,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
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
          onPress={handleRegister}
          style={{
            backgroundColor: "red",
            paddingVertical: 15,
            alignItems: "center",
            borderRadius: 5,
            marginTop: 10,
          }}>
          <Text style={{ color: "#fff" }}>Register</Text>
        </Pressable>
        <Pressable
          onPress={() => navigationServices.goBack("Login")}
          style={{
            flexDirection: "row",
            gap: 10,
            alignSelf: "center",
            marginTop: 10,
          }}>
          <Text style={{ color: theme.colors.text }}>Have an account</Text>
          <Text style={{ color: "#16caee" }}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
