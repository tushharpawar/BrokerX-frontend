import { Dimensions, Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

const CARD_WIDTH = (Dimensions.get("window").width - 30) / 2;

interface StocksHomeCardProps {
  item: {
    logo: string;
    companyName: string;
    price: number;
    change: string;
    percent: string;
    changeRaw: number;
    prevClose: number;
  };
}

const StocksHomeCard: React.FC<StocksHomeCardProps> = ({ item }) => {
  const navigation = useNavigation<any>();
  const previousClosePrice = item?.prevClose || 0;
  const currentPrice = item?.price || 0;

  let change = 0;
  let changePercent = 0;
  
  if (item.change && item.percent) {
    change = parseFloat(item.change);
    changePercent = parseFloat(item.percent);
  } else if (item.changeRaw !== undefined) {
    
    change = item.changeRaw;
    changePercent = previousClosePrice > 0 ? (change / previousClosePrice) * 100 : 0;
  } else if (currentPrice && previousClosePrice && currentPrice !== previousClosePrice) {

    change = currentPrice - previousClosePrice;
    changePercent = (change / previousClosePrice) * 100;
  }

  const isPositive = change >= 0;

  return (
 <TouchableOpacity
      style={styles.cardContainer}
      onPress={()=>navigation.navigate("StocksDetails", { stock: item })}
    >
      <View style={{ flexDirection: "column", marginBottom: 8 }}>
        <Image
          source={{ uri: item.logo }}
          style={{ width: 40, height: 40, borderRadius: 16, marginRight: 8 }}
        />
        <Text style={{ fontWeight: "bold", color: Colors.white, flexShrink: 1 ,marginTop: 4}}>
          {item.companyName}
        </Text>
      </View>
      <Text style={{ color: Colors.white, fontSize: 14,marginTop:12 }}>${currentPrice.toFixed(2)}</Text>
      <Text
        style={{
          color: isPositive ? "limegreen" : "tomato",
          fontWeight: "600",
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </Text>
    </TouchableOpacity>
  )
}

export default StocksHomeCard

const styles = StyleSheet.create({
    cardContainer:{
      flex: 1,
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 10,
        margin: 5,
        width: CARD_WIDTH,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
      }
})