import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomText from '../../components/global/CustomText'
import { useAppSelector } from '../../redux/reduxHook'
import HoldingCard from '../../components/Holdings/HoldingCard'
import useStockLiveAlpacaPrice from '../../hooks/StocksDetailsHooks/useStockLiveAlpacaPrice'
import { ScrollView } from 'react-native-gesture-handler'

const HoldingsScreen = () => {

    const {holdings} = useAppSelector((state:any) => state?.holdings);
    const symbolArray = holdings.map((holding:any) => holding.symbol);
    const {data} = useStockLiveAlpacaPrice(symbolArray);
  return (
    <CustomSafeAreaView>
        <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ 
            marginBottom:60
         }}>
            <CustomText
            style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: '#F5F5F5', 
            }}
            >
            Your Holdings
            </CustomText>
    
            {holdings.length > 0 ? (
            holdings.map((holding:any) => (
                <HoldingCard
                key={holding?.symbol}
                symbol={holding?.symbol}
                quantity={holding?.quantity}
                avgPrice={holding?.avgPrice}
                currentPrice={holding?.price || 0 }
                logo = {holding?.profile?.image}
                prevClose = {holding?.profile?.price}
                companyName={holding?.profile?.companyName}
                price={holding?.profile?.price}
                change={holding?.profile?.changes}
                changePercent={holding?.profile?.changes * 100 / holding?.profile?.price}
                />
            ))
            ) : (
            <CustomText style={{ textAlign: 'center', marginTop: 20 }}>
                No holdings found.
            </CustomText>
            )}
        </ScrollView>
    </CustomSafeAreaView>
  )
}

export default HoldingsScreen

const styles = StyleSheet.create({})