import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'

const BuyButton = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Buy</Text>
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
        borderTopWidth: 1,
        borderColor: Colors.tabBorder,
    },
    button: {
        flex: 1,
        width: '100%',
        padding: 12,
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})