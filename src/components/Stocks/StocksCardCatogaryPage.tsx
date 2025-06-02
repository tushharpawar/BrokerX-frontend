import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomView from '../global/CustomView'
import { Colors } from '../../constants/Colors';


interface StocksCardCatogaryProps {
  item: {
    logo: string;
    companyName: string;
    price: number;
    change: string;
    percent: string;
    changeRaw: number;
  };
}

//Stock category page card component
const StocksCardCatogaryPage: React.FC<StocksCardCatogaryProps> = ({ item }) => {
  return (
 <CustomView
      style={styles.cardContainer}
    >
      <View style={{ marginBottom: 8 }}>
        <Image
          source={{ uri: item.logo }}
          style={{ width: 45, height: 45, borderRadius: 16, marginRight: 8 }}
        />
        <Text style={{ fontWeight: "bold", color: Colors.white, flexShrink: 1 ,marginTop: 4,fontSize: 14}}>
          {item.companyName}
        </Text>
      </View>

    <View>   
     <Text style={{ color: Colors.white, fontSize: 14 }}>${item.price.toFixed(2)}</Text>
      <Text
        style={{
          color: item.changeRaw >= 0 ? "limegreen" : "tomato",
          fontWeight: "600",
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {item.change} ({item.percent})
      </Text>
    </View>
    </CustomView>
  )
}

export default StocksCardCatogaryPage

const styles = StyleSheet.create({
    cardContainer:{
        backgroundColor: Colors.cardBackground, // dark card
        borderRadius: 12,
        padding: 12,
        margin: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
      }
})