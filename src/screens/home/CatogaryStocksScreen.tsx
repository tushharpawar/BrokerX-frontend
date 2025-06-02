import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomView from '../../components/global/CustomView'
import CustomText from '../../components/global/CustomText'
import StocksCardCatogaryPage from '../../components/Stocks/StocksCardCatogaryPage'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppSelector } from '../../redux/reduxHook'
import { getStocksByCategory } from '../../utils/functions/getStocksByCategory'
import { RouteProp } from '@react-navigation/native';

type CatogaryStocksScreenRouteProp = RouteProp<{ params: { category: string } }, 'params'>;

const CatogaryStocksScreen = ({ route }: { route: CatogaryStocksScreenRouteProp }) => {
  const {category} = route.params ;
  const stocks = useAppSelector((state) => state.stocks.stocks);
  const stocksByCategory = getStocksByCategory(stocks, category);
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
