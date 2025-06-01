import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '../../constants/Colors'
import { StyleProp, ViewStyle } from 'react-native';

interface CustomSafeAreaViewProps {
    children?: React.ReactNode;
    style?:ViewStyle;
}

const CustomSafeAreaView = ({children,style}:CustomSafeAreaViewProps) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {/* <View style={[styles.container, style]}> */}
        {children}
      {/* </View> */}
    </SafeAreaView>
  )
}

export default CustomSafeAreaView

const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding:10,
        backgroundColor: Colors.background,
      },
})