import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../../components/global/CustomText'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'

const WatchlistScreen = () => {
  return (
    <CustomSafeAreaView>
        <View>
            <CustomText>Watchlist</CustomText>
        </View>
    </CustomSafeAreaView>
  )
}

export default WatchlistScreen

const styles = StyleSheet.create({})