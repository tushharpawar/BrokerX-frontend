import { View} from 'react-native'
import React, { FC } from 'react'
import CustomView from '../../components/global/CustomView'
import { useAppSelector } from '../../redux/reduxHook'
import StockGrid from '../../components/Stocks/StocksGridHomePage'
import { getStocksByCategory } from '../../utils/functions/getStocksByCategory'
import { ScrollView, Text } from 'react-native-gesture-handler'
import { ViewStyle, TextStyle } from 'react-native';


const HomeScreen:FC = () => {
  const stocks = useAppSelector((state) => state.stocks.stocks);
  const trendingStocks = getStocksByCategory(stocks, 'trending');
  const largeCapStocks = getStocksByCategory(stocks, 'largeCap');
  const midCapStocks = getStocksByCategory(stocks, 'midCap');
  const smallCapStocks = getStocksByCategory(stocks, 'smallCap');


  return (
    <CustomView
    style={{
      padding: 6,
      marginBottom: 60,
    }}
    >
      <ScrollView
      showsVerticalScrollIndicator={false}
      >
        <View 
        style={styles.categoryContainer}
        >
        <Text style={styles.categoryTitle}
        >Tranding on StockX</Text>
        <StockGrid stocks={trendingStocks} title={'Tranding on Stock'} category='trending'/>
        </View>

        <View 
        style={styles.categoryContainer}
        >
        <Text style={styles.categoryTitle}
        >Large cap stocks</Text>
        <StockGrid stocks={largeCapStocks} title={'Large cap stocks'} category='largeCap'/>
        </View>

        <View 
        style={styles.categoryContainer}
        >
        <Text style={styles.categoryTitle}
        >Mid cap stocks</Text>  
        <StockGrid stocks={midCapStocks} title={'Mid cap stocks'} category='midCap'/>
        </View>

        <View 
        style={styles.categoryContainer}
        >
        <Text style={styles.categoryTitle}
        >Small cap stocks</Text>
        
        <StockGrid stocks={smallCapStocks} title={'Small cap stocks'} category='smallCap'/>
        </View>
      </ScrollView>
    </CustomView>
  )
}

export default HomeScreen

const styles: {
  categoryContainer: ViewStyle;
  categoryTitle: TextStyle;
} = {
  categoryContainer: {
    padding:10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F5F5F5', 
  },
};