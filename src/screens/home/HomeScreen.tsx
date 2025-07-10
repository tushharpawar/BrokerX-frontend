import { View, RefreshControl } from 'react-native'
import React, { FC, useState, useCallback } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook'
import StockGrid from '../../components/Stocks/StocksGridHomePage'
import { getStocksByCategory } from '../../utils/functions/getStocksByCategory'
import { ScrollView, Text } from 'react-native-gesture-handler'
import { ViewStyle, TextStyle } from 'react-native'
import { fetchStocks } from '../../redux/actions/stockAction'
import { Colors } from '../../constants/Colors'
import CustomView from '../../components/global/CustomView'

const HomeScreen: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const stocks = useAppSelector((state) => state.stocks.stocks);
  const trendingStocks = getStocksByCategory(stocks, 'trending');
  const largeCapStocks = getStocksByCategory(stocks, 'largeCap');
  const midCapStocks = getStocksByCategory(stocks, 'midCap');
  const smallCapStocks = getStocksByCategory(stocks, 'smallCap');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchStocks());
    } catch (error) {
      console.error('Error refreshing stocks:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  return (
    <CustomView
      style={{
        padding: 6,
        paddingBottom: 100, // Reduced from 150 to 100
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <View 
          style={styles.categoryContainer}
        >
          <Text style={styles.categoryTitle}>
            Trending on StockX
          </Text>
          <StockGrid stocks={trendingStocks} title={'Trending on Stock'} category='trending'/>
        </View>

        <View 
          style={styles.categoryContainer}
        >
          <Text style={styles.categoryTitle}>
            Large cap stocks
          </Text>
          <StockGrid stocks={largeCapStocks} title={'Large cap stocks'} category='largeCap' />
        </View>

        <View 
          style={styles.categoryContainer}
        >
          <Text style={styles.categoryTitle}>
            Mid cap stocks
          </Text>  
          <StockGrid stocks={midCapStocks} title={'Mid cap stocks'} category='midCap'/>
        </View>

        <View 
          style={styles.categoryContainer}
        >
          <Text style={styles.categoryTitle}>
            Small cap stocks
          </Text>
          
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
    padding: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F5F5F5', 
  },
};