import React, { FC } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { mergedStack } from './ScreenCollection';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator();

const MainNavigation:FC = () => {
  return (
    <Stack.Navigator
    initialRouteName="SplashScreen"
    screenOptions={() => ({
      headerShown: false,
    })}
    >
      {mergedStack.map((Screen, index) => (
        <Stack.Screen
          key={index}
          name={Screen.name}
          component={Screen.component}
          options={({ route }) => ({
            title: route?.params?.title || null,
            headerShown: route?.params?.headerShown || false, // Show header unless explicitly set to false
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
          })}
        />
      ))}
    </Stack.Navigator>
  )
}

export default MainNavigation