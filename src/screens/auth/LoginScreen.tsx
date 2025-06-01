import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { FC, useEffect } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomText from '../../components/global/CustomText'
import { Colors } from '../../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomView from '../../components/global/CustomView'
import { useAppDispatch } from '../../redux/reduxHook'
import { signInWithGoogle } from '../../redux/SocialLogin'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const LoginScreen:FC = () => {
const dispatch = useAppDispatch();

// useEffect(() => {
//   GoogleSignin.configure({
//     webClientId: process.env.GOOGLE_CLIENT_ID, // from Firebase
//     offlineAccess: false, // if you need server auth code
//   });
// }, []);

const handleGoogleLogin = async () => {
  try {
    await dispatch(signInWithGoogle());
    console.log('Google Sign-In clicked');
  } catch (e) {
    console.log('Dispatch failed', e);
  }
};
  return (
    <CustomSafeAreaView >

      <CustomText varient='h1' style={{color:Colors.primaryLight}}>Login to STOCKX</CustomText>
    {/* <CustomView style={styles.container}> */}
     <TouchableOpacity style={styles.button} onPress={handleGoogleLogin} activeOpacity={0.8}>
      <Icon name="google" size={20}  style={styles.icon} />
      {/* <CustomText varient='h4' style={{color:Colors.background}}>Continue with Google</CustomText> */}
    </TouchableOpacity>
    {/* </CustomView> */}

    <TouchableOpacity style={styles.button} onPress={() => { Alert.alert("Clicked");console.log('Pressed'); }} activeOpacity={0.8}>
      <Text>Hello</Text>
    </TouchableOpacity>
    </CustomSafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
});
