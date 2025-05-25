import { View, Text } from 'react-native'
import React, { FC } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { mergedStack } from './ScreenCollection';

const Stack = createNativeStackNavigator();

const MainNavigation:FC = () => {
  return (
    <Stack.Navigator
    screenOptions={() => ({
      headerShown: false,
    })}
    >
      {mergedStack.map((Screen, index) => (
        <Stack.Screen
          key={index}
          name={Screen.name}
          component={Screen.component}
        />
      ))}
    </Stack.Navigator>
  )
}

export default MainNavigation