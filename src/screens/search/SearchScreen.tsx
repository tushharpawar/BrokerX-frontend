import { View, Text } from 'react-native'
import React, { FC } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'

const SearchScreen:FC = () => {
  return (
    <CustomView>
      <Text style={{
        color:Colors.grey1
      }}>SearchScreen</Text>
    </CustomView>
  )
}

export default SearchScreen