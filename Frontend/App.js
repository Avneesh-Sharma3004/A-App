import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/module/home";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import RootNavigator from "./src/navigator/rootNavigator";
import AppNavigationContainer from "./src/navigator";
import { ThemeProvider } from "./src/theme/ThemeContext";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigationContainer />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

///asihawdhas sahdo sduas d//

// sadhasidsua dsaud asuhd sadhisa ou dh dasi odsad hsad osadhoasd as odashod asdsad
// sadjsa dsad asodasdsa
