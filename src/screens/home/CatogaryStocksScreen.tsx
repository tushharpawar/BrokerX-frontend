import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import CustomView from '../../components/global/CustomView'
import CustomText from '../../components/global/CustomText'
import StocksCardCatogaryPage from '../../components/Stocks/StocksCardCatogaryPage'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppSelector } from '../../redux/reduxHook'
import { getStocksByCategory } from '../../utils/functions/getStocksByCategory'
import { RouteProp, useNavigation } from '@react-navigation/native';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'

type CatogaryStocksScreenRouteProp = RouteProp<{ params: { category: string } }, 'params'>;

const CatogaryStocksScreen = ({ route }: { route: CatogaryStocksScreenRouteProp }) => {
  const {category} = route.params ;
  const stocks = useAppSelector((state) => state.stocks.stocks);
  const stocksByCategory = getStocksByCategory(stocks, category);
  const navigation = useNavigation<any>()
  useEffect(()=>{
    navigation.setOptions({
      headerShown: true,
    });
  },[])
  return (
    <CustomView>
    <ScrollView>
            {
            stocksByCategory.map((item: { logo: string; companyName: string; price: number; change: string; percent: string; changeRaw: number }, index: React.Key | null | undefined) => (
              <StocksCardCatogaryPage
                key={index}
                item={item}
              />
            ))
          }
    </ScrollView>
    </CustomView>
  )
}

export default CatogaryStocksScreen
