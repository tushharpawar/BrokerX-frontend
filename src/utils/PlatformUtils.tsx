import { Platform, StatusBar, Dimensions } from 'react-native';

// Get the actual screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Android specific constants
const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

// iOS specific constants
const IOS_STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

// Check if device is iPhone X or newer with notch
const isIphoneX = () => {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (SCREEN_HEIGHT === 812 ||
      SCREEN_WIDTH === 812 ||
      SCREEN_HEIGHT === 896 ||
      SCREEN_WIDTH === 896 ||
      SCREEN_HEIGHT === 844 ||
      SCREEN_WIDTH === 844 ||
      SCREEN_HEIGHT === 926 ||
      SCREEN_WIDTH === 926)
  );
};

// Check if device is Android with notch/cutout
const hasAndroidNotch = () => {
  return Platform.OS === 'android' && ANDROID_STATUS_BAR_HEIGHT > 24;
};

// Get the correct status bar height for each platform
export const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return ANDROID_STATUS_BAR_HEIGHT;
  }
  return isIphoneX() ? 44 : 20;
};

// Get the correct header height for each platform
export const getHeaderHeight = () => {
  if (Platform.OS === 'android') {
    return 56;
  }
  return isIphoneX() ? 88 : 64;
};

// Get the correct bottom safe area height
export const getBottomSafeAreaHeight = () => {
  if (Platform.OS === 'android') {
    return 0;
  }
  return isIphoneX() ? 34 : 0;
};

// Check if device is tablet
export const isTablet = () => {
  const pixelDensity = Dimensions.get('window').scale;
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  }
  return (
    pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
  );
};

// Platform specific shadow styles
export const getPlatformShadow = (elevation: number = 2) => {
  if (Platform.OS === 'android') {
    return {
      elevation,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: elevation,
  };
};

// Platform specific ripple/touch feedback
export const getPlatformTouchProps = () => {
  if (Platform.OS === 'android') {
    return {
      android_ripple: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderless: false,
      },
    };
  }
  return {
    activeOpacity: 0.7,
  };
};

export const PlatformConstants = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isIphoneX: isIphoneX(),
  hasAndroidNotch: hasAndroidNotch(),
  isTablet: isTablet(),
  statusBarHeight: getStatusBarHeight(),
  headerHeight: getHeaderHeight(),
  bottomSafeAreaHeight: getBottomSafeAreaHeight(),
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
};
