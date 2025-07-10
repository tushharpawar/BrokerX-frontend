import { StyleSheet, View, Platform, StatusBar } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '../../constants/Colors'
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlatformConstants } from '../../utils/PlatformUtils';

interface CustomSafeAreaViewProps {
    children?: React.ReactNode;
    style?: ViewStyle;
    edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
    backgroundColor?: string;
}

const CustomSafeAreaView = ({
  children, 
  style, 
  edges = ['top', 'left', 'right'], 
  backgroundColor = Colors.background
}: CustomSafeAreaViewProps) => {
  const insets = useSafeAreaInsets();
  
  // For Android, we need to handle the status bar more carefully
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.container, { backgroundColor }, style]}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={backgroundColor} 
          translucent={false}
        />
        <View style={[styles.androidContent, { paddingTop: insets.top }]}>
          {children}
        </View>
      </View>
    );
  }
  
  // For iOS, use SafeAreaView with edges
  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor }, 
        style
      ]} 
      edges={edges}
    >
      {children}
    </SafeAreaView>
  )
}

export default CustomSafeAreaView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidContent: {
    flex: 1,
  },
})
