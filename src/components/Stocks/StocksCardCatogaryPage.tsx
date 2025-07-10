import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';


interface StocksCardCatogaryProps {
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

const StocksCardCatogaryPage: React.FC<StocksCardCatogaryProps> = ({ item }) => {
  const navigation = useNavigation<any>()
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
      onPress={() => navigation.navigate("StocksDetails",{ stock: item })}
    >
      <View style={styles.leftSection}>
        <Image
          source={{ uri: item.logo }}
          style={styles.logo}
        />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName} numberOfLines={2}>
            {item.companyName}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>   
        <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
        <Text
          style={[
            styles.change,
            { color: isPositive ? "limegreen" : "tomato" }
          ]}
        >
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default StocksCardCatogaryPage

const styles = StyleSheet.create({
    cardContainer:{
        backgroundColor: Colors.cardBackground, // dark card
        borderRadius: 12,
        padding: 16,
        margin: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginVertical: 8,
      },
      leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      logo: {
        width: 45,
        height: 45,
        borderRadius: 16,
        marginRight: 12,
      },
      companyInfo: {
        flex: 1,
        justifyContent: 'center',
      },
      companyName: {
        fontWeight: "bold",
        color: Colors.white,
        fontSize: 14,
        flexShrink: 1,
      },
      rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
      },
      price: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
      },
      change: {
        fontWeight: "600",
        fontSize: 14,
        textAlign: 'right',
      },
})