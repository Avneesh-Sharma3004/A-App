import { Colors } from "./Colors";

export const lightTheme = {
  mode: "light",

  colors: {
    background: "#FFFFFF",
    card: "#F5F5F5",
    text: "#000000",
    border: "#DDDDDD",
    icon: "#000",
    inputBorder: "#000",
    logoutText: "red",

    primary: Colors.primary,
    secondary: Colors.secondary,
    danger: Colors.danger,
  },
};

export const darkTheme = {
  mode: "dark",

  colors: {
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#333333",
    icon: "#fff",
    inputBorder: "#FFFFFF",
    logoutText: "red",

    primary: Colors.primary,
    secondary: Colors.secondary,
    danger: Colors.danger,
  },
};
