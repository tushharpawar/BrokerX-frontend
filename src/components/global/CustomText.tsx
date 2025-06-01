import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';

interface Props{
    varient?:'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8' | 'h9' | 'body';
    fontFamily?: 'Poppins' | 'Roboto' | 'Arial';
    fontSize?: number;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    noOfLines?: number;
    onLayout?: (event: object) => void;
}

const CustomText:FC <Props> = ({
    varient = 'body',
    fontFamily = 'Poppins',
    fontSize ,
    style,
    children,
    noOfLines = 1,
    onLayout,
}) => {
    let computedFontSize:number;
    switch (varient) {
        case 'h1':
            computedFontSize = RFValue(fontSize || 22);
            break;
        case 'h2':
            computedFontSize = RFValue(fontSize||20);
            break;
        case 'h3':
            computedFontSize = RFValue(fontSize||18);
            break;
        case 'h4':
            computedFontSize = RFValue(fontSize||16);
            break;
        case 'h5':
            computedFontSize = RFValue(fontSize||14);
            break;
        case 'h6':
            computedFontSize = RFValue(fontSize||12);
            break;
        case 'h7':
            computedFontSize = RFValue(fontSize||10);
            break;
        case 'h8':
            computedFontSize = RFValue(fontSize||9);
            break;
        case 'h9':
            computedFontSize = RFValue(fontSize||8);
            break;
        case 'body':
        default:
            computedFontSize = RFValue(fontSize||14);
            break;
    }
  return (
    <View style={[styles.container, style]} >
      <Text
      onLayout={onLayout}
      style={[
        styles.text,
        {
          fontFamily: fontFamily,
          fontSize: computedFontSize,
          flexWrap: 'wrap',
          color:Colors.grey0,
        },
        style
      ]}
      numberOfLines={noOfLines}
      >{children}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        flexWrap:'wrap',
    },
    text: {
        textAlign: 'left',
    },
})

export default CustomText
