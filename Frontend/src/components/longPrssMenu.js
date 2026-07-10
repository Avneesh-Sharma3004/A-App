import React, { useState } from "react";
import {
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

const LongPressMenu = ({ children, options = [], longPressDelay = 500 }) => {
  const [visible, setVisible] = useState(false);

  const handlePress = (item) => {
    setVisible(false);

    if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <>
      <Pressable
        delayLongPress={longPressDelay}
        onLongPress={() => {
          console.log("Long Press");
          setVisible(true);
        }}
      >
        {children}
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.popup}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handlePress(item)}
              >
                <Text style={[styles.text, item.danger && { color: "red" }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default LongPressMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 8,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  text: {
    fontSize: 16,
    color: "#222",
  },
});
