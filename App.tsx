import 'react-native-gesture-handler';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigation from './src/navigation/Navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomSafeAreaView from './src/components/global/CustomSafeAreaView';

GoogleSignin.configure({
  webClientId: '502659074621-3hb7re7m5v9vibimb01ifte1tmfs0bmj.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar translucent={Platform.OS === 'ios'} backgroundColor={'transparent'} />
      <CustomSafeAreaView>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
      </CustomSafeAreaView>
    </GestureHandlerRootView>
  )
}

export default App
