import { View, Text, StyleSheet, Animated, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Logo from '../../assets/images/tplogo.png'
import CustomText from '../../components/global/CustomText'
import { token_storage } from '../../redux/storage'
import {jwtDecode} from 'jwt-decode'
import { resetAndNavigate } from '../../utils/NavigationUtils'
import { referesh_tokens } from '../../redux/apiConfig'
import { useAppDispatch } from '../../redux/reduxHook'
import { refetchUser } from '../../redux/actions/userAction'

interface DecodedToken {
  exp: number;
}

const SplashScreen:FC = () => {

  const [isStop,setIsStop] = useState(false);
  const scale = new Animated.Value(1);
  const dispatch = useAppDispatch();

  //check if the user has a token in storage
  //if yes, navigate to the home screen
  //if no, navigate to the login screen
  async function checkToken() {
    const access_token = await token_storage.getString('access_token') as string;
    const referesh_token = await token_storage.getString('referesh_token') as string;

    console.log("Access Token:", access_token);
    console.log("Refresh Token:", referesh_token);

    if(access_token){
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(referesh_token);
      const currentTime:number = Math.floor(Date.now() / 1000); // Current time in seconds

      if(decodedRefreshToken?.exp < currentTime){
        resetAndNavigate('LoginScreen');
        return
      }

      if(decodedAccessToken?.exp < currentTime){
        try {
          console.log("Access token expired, refreshing token...");
          referesh_tokens()
          dispatch(refetchUser)
        } catch (error) {
          console.error("Error refreshing token:", error);
          Alert.alert("Session Expired")
          return;
        }
      }
      console.log("Access token is valid, navigating to home screen.");
      resetAndNavigate('BottomTab')
      return
    }
    resetAndNavigate('LoginScreen');
  }

  // This function should be implemented to check the token
  useEffect(() => {
    async function deeplLinks(){
      await checkToken()
    }

    deeplLinks();
  }, [])


  //Animation to scale the logo up and down

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    )

    if(!isStop) {
      breathingAnimation.start();
    }

    return () => {
      breathingAnimation.stop();
    }
  }, [isStop])

  

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer]}>
        <Animated.Image 
          source={Logo} 
          style={{
            width: "60%",
            height: "25%",
            resizeMode: 'contain',
            transform: [{ scale }],
          }} 
        />
        <CustomText varient='body'>Let's stockxs</CustomText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default SplashScreen