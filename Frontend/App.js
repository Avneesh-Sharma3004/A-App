import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/module/home';
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import RootNavigator from './src/navigator/rootNavigator';
import AppNavigationContainer from './src/navigator';

export default function App() {
  return (
    <Provider store={store}>
    <AppNavigationContainer/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
});
