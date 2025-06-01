import { View, Text, FlatList, Image } from 'react-native'
import React, { FC, useEffect } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'
import useLiveStocks from '../../hooks/useLiveStocks'
import { useAppSelector } from '../../redux/reduxHook'
import { useSelector } from 'react-redux'
import { fetchStocks } from '../../redux/actions/stockAction'

const HomeScreen:FC = () => {
  useLiveStocks();
  // useEffect(()=>{
  //   fetchStocks()
  // })
  const stocks = useAppSelector((state) => state.stocks.stocks);
  console.log("Stocks:", stocks);
  return (
    <CustomView>
      <Text style={{
        color:Colors.grey1,
        fontSize: 24,
      }}>HomeScreen</Text>

      <FlatList
      data={stocks}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }} key={item.symbol}>
          <Image
            source={{ uri: item.logo }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <Text style={{ fontWeight: "bold",color:'white' }}>{item.companyName}</Text>
          <Text style={{color:(item.percent > 0 || item.percent == '0.00%') ? "green" : "red"}}>${item.price.toFixed(2)}</Text>
          <Text style={{ color: (item.price-item.prevClose) > 0 ? "green" : "red" }}>
             {item.price-item.prevClose > 0 ? "+" : ""}{(item.price-item.prevClose).toFixed(2)} 
             ({((item.price-item.prevClose)*100/item.price ).toFixed(2)}%)
          </Text>
        </View>
      )}
    />
    </CustomView>
  )
}

export default HomeScreen