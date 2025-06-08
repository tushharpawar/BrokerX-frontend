import { Dimensions, Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomView from '../global/CustomView'
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
  };
}

const StocksHomeCard: React.FC<StocksHomeCardProps> = ({ item }) => {
  const navigation = useNavigation<any>();
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
      <Text style={{ color: Colors.white, fontSize: 14,marginTop:12 }}>${item.price.toFixed(2)}</Text>
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
    </TouchableOpacity>
  )
}

export default StocksHomeCard

const styles = StyleSheet.create({
    cardContainer:{
      flex: 1,
        backgroundColor: Colors.cardBackground, // dark card
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