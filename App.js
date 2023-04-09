import * as React from 'react';
import { AppRegistry, useColorScheme } from 'react-native';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { name as appName } from './app.json';
import Main from './pages/Main';
import { AppContextProvider } from './pages/AppContextProvider';

import { MD3LightTheme, MD3DarkTheme, MD2LightTheme, MD2DarkTheme } from 'react-native-paper';


export default function App() {
  // const colorScheme = useColorScheme();
  // console.log(colorScheme)
  // const theme = colorScheme==='dark' ? MD3DarkTheme : MD3LightTheme

  //const theme = useTheme();

  return (
    <AppContextProvider>
    <PaperProvider>
      <Main />
    </PaperProvider>
    </AppContextProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
