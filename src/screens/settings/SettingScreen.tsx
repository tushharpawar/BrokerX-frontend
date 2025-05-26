import { View, Text } from 'react-native'
import React, { FC } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'


const SettingScreen:FC = () => {
  return (
    <CustomView>
      <Text style={{
        color:Colors.grey1,
        fontSize: 24,
      }}>SettingScreen</Text>
    </CustomView>
  )
}

export default SettingScreen