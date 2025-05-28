import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import Logo from '../../assets/images/tplogo.png'

const SplashScreen:FC = () => {

  const [isStop,setIsStop] = useState(false);
  const scale = new Animated.Value(1);

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