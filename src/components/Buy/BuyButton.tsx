import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'

const BuyButton = ({onPress= ()=>{}, error=null, title="Buy", backgroundColor="#4CAF50", isLoading=false}:any) => {
  const isDisabled = (error && error.length > 0) || isLoading;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.button,
          { backgroundColor: backgroundColor },
          isDisabled && { opacity: 0.3 }
        ]} 
        onPress={onPress} 
        disabled={isDisabled}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default BuyButton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingTop: 20,
    },
    button: {
        flex: 1,
        width: '100%',
        padding: 12,
        borderRadius: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})