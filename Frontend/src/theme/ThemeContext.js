import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "./Themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");

    if (saved === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme.mode === "light" ? darkTheme : lightTheme;

    setTheme(newTheme);

    await AsyncStorage.setItem("theme", newTheme.mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme.mode === "dark",
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
