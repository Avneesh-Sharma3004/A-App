// import React from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   StyleSheet,
//   TextInput,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "../../theme/ThemeContext";
// import navigationServices from "../../navigator/navigationServices";
// import ChatHeader from "../../components/ChatHeader.";
// import Ionicons from "react-native-vector-icons/Ionicons";

// export default function ChatScreen({ route }) {
//   const { item } = route.params;

//   const { theme } = useTheme();

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: theme.colors.background,
//       }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}>
//         <View
//           style={{
//             flex: 1,
//             paddingHorizontal: 15,
//           }}>
//           {/* Header */}
//           <ChatHeader item={item} onBack={() => navigationServices.goBack()} />

//           {/* Messages */}
//           <View style={{ flex: 1 }}>
//             {/* Future me FlatList messages yaha */}
//           </View>

//           {/* Message Input */}
//           <View style={styles.messageContainer}>
//             <TextInput
//               placeholder="Send Message..."
//               placeholderTextColor={theme.colors.text}
//               style={[
//                 styles.messageInput,
//                 {
//                   color: theme.colors.text,
//                   borderColor: theme.colors.inputBorder,
//                 },
//               ]}
//             />

//             <Pressable
//               style={styles.sendButton}
//               onPress={() => console.log("Send message")}>
//               <Ionicons name="send" size={20} color="#fff" />
//             </Pressable>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   messageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   messageInput: {
//     flex: 1,
//     height: 45,
//     borderWidth: 1,
//     borderRadius: 23,
//     paddingHorizontal: 15,
//     fontSize: 15,
//   },

//   sendButton: {
//     height: 45,
//     width: 45,
//     borderRadius: 23,
//     backgroundColor: "#2196F3",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 8,
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import navigationServices from "../../navigator/navigationServices";
import ChatHeader from "../../components/ChatHeader.";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";

import {
  getMessagesThunk,
  sendMessageThunk,
  addMessage,
  markMessagesRead,
  markMessagesAsReadThunk,
} from "../../redux/slices/messageslice";
import { checkUserOnline, socket } from "../../services/SocketServices";

export default function ChatScreen({ route }) {
  const [isTyping, setIsTyping] = useState(false);
  const { item } = route.params;

  const { theme } = useTheme();

  const dispatch = useDispatch();

  const { messages, loading, sendLoading } = useSelector(
    (state) => state.message,
  );

  const { profile } = useSelector((state) => state.profile);
  const { onlineUsers } = useSelector((state) => state.presence);

  const receiverId = item._id;
  const currentUserId = profile?._id;

  const isOnline = onlineUsers.includes(receiverId);
  console.log("ONLINE USERS =>", onlineUsers);
  console.log("TARGET USER =>", receiverId);
  console.log("IS ONLINE =>", isOnline);

  const [message, setMessage] = useState("");

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!receiverId) return;

    checkUserOnline(receiverId);
  }, [receiverId]);

  // Receiver ID

  // Current logged-in user ID

  // =========================
  // LOAD MESSAGES
  // =========================

  useEffect(() => {
    if (!receiverId) return;

    const loadChat = async () => {
      try {
        await dispatch(getMessagesThunk(receiverId)).unwrap();

        await dispatch(markMessagesAsReadThunk(receiverId)).unwrap();
      } catch (error) {
        console.log("Chat Error =>", error);
      }
    };

    loadChat();
  }, [receiverId, dispatch]);

  // =========================
  // SOCKET CONNECT
  // =========================

  // =========================
  // RECEIVE NEW MESSAGE
  // =========================

  useEffect(() => {
    const handleNewMessage = async (newMessage) => {
      console.log("New Message =>", newMessage);

      const senderId = newMessage.sender?._id;
      const receiverIdFromMessage = newMessage.receiver?._id;

      const isCurrentChat =
        (senderId === item._id && receiverIdFromMessage === currentUserId) ||
        (senderId === currentUserId && receiverIdFromMessage === item._id);

      if (!isCurrentChat) {
        return;
      }

      // Message UI me turant add
      dispatch(addMessage(newMessage));

      // Agar message saamne wale ne bheja hai,
      // aur hum current chat screen par hain,
      // to immediately read mark karo
      if (senderId === item._id && receiverIdFromMessage === currentUserId) {
        try {
          await dispatch(markMessagesAsReadThunk(item._id)).unwrap();
        } catch (error) {
          console.log("Auto Read Error =>", error);
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch, item._id, currentUserId]);

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSendMessage = async () => {
    const text = message.trim();

    if (!text || !receiverId) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("stopTyping", {
      receiverId,
    });

    try {
      await dispatch(
        sendMessageThunk({
          receiverId,
          message: text,
        }),
      ).unwrap();

      setMessage("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    } catch (error) {
      console.log("Send Message Error =>", error);
    }
  };

  useEffect(() => {
    const handleMessagesRead = (data) => {
      console.log("👀 Messages Read =>", data);

      dispatch(markMessagesRead(data));
    };

    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [dispatch]);

  // =========================
  // SCROLL TO BOTTOM
  // =========================

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: false,
        });
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    const handleUserTyping = (data) => {
      if (data.userId === item._id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data) => {
      if (data.userId === item._id) {
        setIsTyping(false);
      }
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [item._id]);

  const handleTyping = (text) => {
    setMessage(text);

    if (!currentUserId || !receiverId) {
      return;
    }

    // Har baar typing event bhejo
    socket.emit("typing", {
      receiverId,
    });

    // Purana timer clear
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 1.5 sec tak type nahi kiya = stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId,
      });
    }, 1500);
  };
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
          {/* Header */}

          <ChatHeader
            item={item}
            isTyping={isTyping}
            isOnline={isOnline}
            onBack={() => navigationServices.goBack()}
          />

          {/* Messages */}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            renderItem={({ item: msg }) => {
              const isMyMessage = msg.sender?._id === currentUserId;

              return (
                <View
                  style={[
                    styles.messageBubble,
                    {
                      alignSelf: isMyMessage ? "flex-end" : "flex-start",

                      backgroundColor: isMyMessage
                        ? "#2196F3"
                        : theme.colors.card,
                    },
                  ]}>
                  <Text
                    style={{
                      color: isMyMessage ? "#fff" : theme.colors.text,
                    }}>
                    {msg.message}
                  </Text>

                  {/* Read status */}

                  {isMyMessage && (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#fff",
                        marginTop: 3,
                        textAlign: "right",
                      }}>
                      {msg.isRead ? "Read" : "Sent"}
                    </Text>
                  )}
                </View>
              );
            }}
          />

          {/* Message Input */}

          <View style={styles.messageContainer}>
            <TextInput
              placeholder="Send Message..."
              placeholderTextColor={theme.colors.text}
              value={message}
              onChangeText={handleTyping}
              multiline
              style={[
                styles.messageInput,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            />

            <Pressable
              disabled={sendLoading}
              style={[
                styles.sendButton,
                {
                  opacity: sendLoading ? 0.5 : 1,
                },
              ]}
              onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  messageInput: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 23,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },

  sendButton: {
    height: 45,
    width: 45,
    borderRadius: 23,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    marginVertical: 4,
  },
});
