import { View, Text } from 'react-native'
import React, { FC } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'

const NewsScreen:FC = () => {
  return (
    <CustomView>
      <Text
      style={{
        color: Colors.grey1,
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
      }}
      >NewsScreen</Text>
    </CustomView>
  )
}

export default NewsScreen