// import React from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useTheme } from "../theme/ThemeContext";

// export default function ChatHeader({ item, isTyping, onBack, isOnline }) {
//   const { theme } = useTheme();

//   return (
//     <View style={styles.container}>
//       {/* Left Side */}
//       <View style={styles.leftSection}>
//         <Pressable onPress={onBack} style={styles.backButton}>
//           <Ionicons
//             name="chevron-back-outline"
//             size={25}
//             color={theme.colors.icon}
//           />
//         </Pressable>

//         <View style={styles.profileImage}>
//           <Text style={styles.profileLetter}>
//             {item.name?.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//         <View>
//           <Text
//             numberOfLines={1}
//             style={[
//               styles.name,
//               {
//                 color: theme.colors.text,
//               },
//             ]}>
//             {item.name}
//           </Text>

//           {isTyping && (
//             <Text style={[styles.typingText, { color: theme.colors.text }]}>
//               typing...
//             </Text>
//           )}
//         </View>
//       </View>

//       {/* Right Side */}
//       <View style={styles.actions}>
//         <Pressable>
//           <Ionicons name="call-outline" size={25} color={theme.colors.icon} />
//         </Pressable>

//         <Pressable>
//           <Ionicons
//             name="videocam-outline"
//             size={25}
//             color={theme.colors.icon}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     height: 60,
//   },

//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   backButton: {
//     marginRight: 8,
//   },

//   profileImage: {
//     height: 42,
//     width: 42,
//     borderRadius: 21,
//     backgroundColor: "#dadada",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   profileLetter: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },

//   name: {
//     fontSize: 17,
//     fontWeight: "500",
//     marginLeft: 8,
//     maxWidth: 150,
//   },

//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//   },
//   typingText: {
//     fontSize: 12,
//     marginTop: 1,
//     marginLeft: 10,
//   },
// });

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";

export default function ChatHeader({ item, isTyping, onBack, isOnline }) {
  // console.log(isOnline);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftSection}>
        {/* Back */}
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back-outline"
            size={25}
            color={theme.colors.icon}
          />
        </Pressable>

        {/* Profile */}
        <View style={styles.profileImage}>
          <Text style={styles.profileLetter}>
            {item.name?.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Name + Status */}
        <View style={styles.infoContainer}>
          {/* Name */}
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: theme.colors.text,
              },
            ]}>
            {item.name}
          </Text>

          {/* Status */}
          {isTyping ? (
            <Text style={styles.typingText}>typing...</Text>
          ) : isOnline ? (
            <Text style={styles.onlineText}>Online</Text>
          ) : null}
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.actions}>
        <Pressable>
          <Ionicons name="call-outline" size={25} color={theme.colors.icon} />
        </Pressable>

        <Pressable>
          <Ionicons
            name="videocam-outline"
            size={25}
            color={theme.colors.icon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  backButton: {
    marginRight: 8,
  },

  profileImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: "#dadada",
    alignItems: "center",
    justifyContent: "center",
  },

  profileLetter: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  infoContainer: {
    marginLeft: 8,
    justifyContent: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "500",
    maxWidth: 150,
  },

  onlineText: {
    fontSize: 12,
    color: "#22C55E",
    marginTop: 1,
  },

  typingText: {
    fontSize: 12,
    color: "#2196F3",
    marginTop: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});
