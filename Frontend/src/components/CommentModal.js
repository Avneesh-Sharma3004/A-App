import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { addCommentThunk } from "../redux/slices/postslice";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CommentsModal({ visible, onClose, postId }) {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy);
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 150) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const dispatch = useDispatch();

  const commentsData = useSelector(
    (state) => state.post.commentsByPost[postId],
  );

  const comments = commentsData?.comments || [];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sheet,
              {
                transform: [{ translateY }],
                backgroundColor: theme.colors.background,
              },
            ]}>
            <View style={styles.handle} />

            <Text style={[styles.title, { color: theme.colors.text }]}>
              Comments
            </Text>

            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              data={comments}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={[styles.name, { color: theme.colors.text }]}>
                    {item.user?.name}
                  </Text>

                  <Text style={{ color: theme.colors.text }}>{item.text}</Text>
                </View>
              )}
            />

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.colors.background,
                  borderTopColor: theme.colors.border,
                },
              ]}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add a comment..."
                style={[styles.input, { color: theme.colors.text }]}
                placeholderTextColor={theme.colors.text}
              />
              <TouchableOpacity
                onPress={async () => {
                  if (!text.trim()) return;

                  await dispatch(
                    addCommentThunk({
                      postId,
                      text,
                    }),
                  );

                  setText("");
                }}>
                <Text style={styles.send}>Post</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    height: SCREEN_HEIGHT * 0.75,

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    paddingHorizontal: 15,
    paddingTop: 10,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#bbb",
    alignSelf: "center",
    marginVertical: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },

  comment: {
    marginBottom: 18,
  },

  name: {
    fontWeight: "700",
    marginBottom: 2,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  send: {
    color: "#0095F6",
    fontWeight: "700",
    marginLeft: 15,
  },
});
