import { View, Text } from 'react-native'
import React, { FC } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'

const HomeScreen:FC = () => {
  return (
    <CustomView>
      <Text style={{
        color:Colors.grey1,
        fontSize: 24,
      }}>HomeScreen</Text>
    </CustomView>
  )
}

export default HomeScreen