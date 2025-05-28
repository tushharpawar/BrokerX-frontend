import {ReactNode} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '../../constants/Colors';

interface CustomViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomView = ({children, style}: CustomViewProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default CustomView;
