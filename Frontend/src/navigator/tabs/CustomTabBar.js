import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
export default function CustomTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { options } = descriptors[route.key];

        const label = options.tabBarLabel ?? options.title ?? route.name;

        const icon = options.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}>
            <Image
              source={icon}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
                tintColor: isFocused ? theme.colors.primary : theme.colors.icon,
              }}
            />

            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.colors.primary : theme.colors.text,
                },
              ]}>
              {label}
            </Text>

            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  indicator: {
    // position: "absolute",
    bottom: 0,
    width: "50%",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#007AFF",
  },
});
