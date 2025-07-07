import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { FC } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomText from '../../components/global/CustomText'
import { Colors } from '../../constants/Colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '../../components/global/GoogleIcon';
import { useAppDispatch } from '../../redux/reduxHook'
import { signInWithGoogle } from '../../redux/SocialLogin'
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const LoginScreen:FC = () => {
const dispatch = useAppDispatch();

const handleGoogleLogin = async () => {
  try {
    await dispatch(signInWithGoogle());
    console.log('Google Sign-In clicked');
  } catch (e) {
    console.log('Dispatch failed', e);
  }
};

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.logoGradient}
            >
              <Ionicons name="trending-up" size={40} color={Colors.white} />
            </LinearGradient>
          </View>
          <CustomText varient='h1' style={styles.appTitle}>BrokerX</CustomText>
          <CustomText varient='h4' style={styles.appSubtitle}>
            Your Gateway to Smart Trading
          </CustomText>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.welcomeSection}>
            <CustomText varient='h2' style={styles.welcomeTitle}>
              Welcome Back
            </CustomText>
            <CustomText varient='h5' style={styles.welcomeSubtitle}>
              Sign in to continue your trading journey
            </CustomText>
          </View>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleLogin} 
            activeOpacity={0.8}
          >
            <View style={styles.googleButtonContent}>
              <GoogleIcon size={24} style={styles.googleIcon} />
              <CustomText varient='h4' style={styles.googleButtonText}>
                Continue with Google
              </CustomText>
            </View>
          </TouchableOpacity>

          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
              <CustomText varient='h6' style={styles.featureText}>Secure & Protected</CustomText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={20} color={Colors.primary} />
              <CustomText varient='h6' style={styles.featureText}>Lightning Fast</CustomText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={20} color={Colors.primary} />
              <CustomText varient='h6' style={styles.featureText}>Real-time Data</CustomText>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <CustomText varient='h7' style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CustomText>
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    color: Colors.grey1,
    textAlign: 'center',
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: Colors.grey2,
    textAlign: 'center',
    lineHeight: 22,
  },
  googleButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: width * 0.85,
    maxWidth: 320,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.grey4,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  featuresSection: {
    marginTop: 48,
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    color: Colors.grey1,
    marginLeft: 12,
    opacity: 0.9,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    color: Colors.grey3,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});
