import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function FlotingButton({onPress}) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,

    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: "red",

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  plus: {
    color: "#fff",
    fontSize: 40,
    lineHeight: 45,
  },
});
