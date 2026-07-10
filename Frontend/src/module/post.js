import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createPostThunk, fetchPosts } from "../redux/slices/postslice";
import navigationServices from "../navigator/navigationServices";

export default function Post() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  const { createLoading } = useSelector((state) => state.post);

  const pickimage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    if (!image) {
      Alert.alert("Please select an image.");
      return;
    }

    if (!caption.trim()) {
      Alert.alert("Please enter caption.");
      return;
    }

    const formData = new FormData();

    formData.append("caption", caption);

    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      await dispatch(createPostThunk(formData)).unwrap();

      dispatch(fetchPosts());

      navigationServices.navigate("Home");

      setCaption("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", error);
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 15, flex: 1 }}>
        <Pressable style={styles.imagecontainer} onPress={pickimage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
              }}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/image-upload.png")}
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 10,
                }}
              />
              <Text>Upload Image</Text>
            </View>
          )}
        </Pressable>

        <TextInput
          placeholder="Enter Your Caption..."
          numberOfLines={5}
          value={caption}
          onChangeText={setCaption}
          style={styles.input}
        />
        <Pressable
          style={styles.button}
          onPress={submitPost}
          disabled={createLoading}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "400",
              color: "#fff",
            }}
          >
            {createLoading ? "Uploading..." : "Post"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imagecontainer: {
    borderWidth: 1,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  image: {
    height: 100,
    width: 100,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#07aacc",
    paddingVertical: 10,
    alignSelf: "center",
    width: "100%",
    borderRadius: 5,
    marginTop: 10,
  },
});
