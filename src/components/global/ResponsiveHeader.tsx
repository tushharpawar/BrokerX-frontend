import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { normalizeModerately, normalizeHeight } from '../../utils/Scaling';
import { PlatformConstants, getPlatformShadow } from '../../utils/PlatformUtils';

interface ResponsiveHeaderProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  style?: any;
  showShadow?: boolean;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  backgroundColor = Colors.background,
  titleColor = Colors.white,
  style,
  showShadow = true,
}) => {
  const insets = useSafeAreaInsets();

  // More consistent padding across platforms
  const headerPaddingTop = Platform.OS === 'android' ? 12 : 10;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: headerPaddingTop,
          ...(showShadow && getPlatformShadow(3)),
        },
        style,
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {leftComponent}
        </View>
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    minHeight: normalizeHeight(44),
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: normalizeModerately(18),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ResponsiveHeader;
