import { StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import CustomText from '../../components/global/CustomText'
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook'
import HoldingCard from '../../components/Holdings/HoldingCard'
import useStockLiveAlpacaPrice from '../../hooks/StocksDetailsHooks/useStockLiveAlpacaPrice'
import { ScrollView } from 'react-native-gesture-handler'
import { getHoldingsAction } from '../../redux/actions/buyAction'
import { useSelector } from 'react-redux'
import { Colors } from '../../constants/Colors'

const HoldingsScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: any) => state.user);
    const { holdings } = useAppSelector((state: any) => state?.holdings);
    const symbolArray = holdings.map((holding: any) => holding.symbol);
    const { data } = useStockLiveAlpacaPrice(symbolArray);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            if (user?._id) {
                await dispatch(getHoldingsAction({ userId: user._id }));
            }
        } catch (error) {
            console.error('Error refreshing holdings:', error);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch, user?._id]);

    return (
        <CustomSafeAreaView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ 
                    marginBottom: 180
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                }
            >
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
                    holdings.map((holding: any) => {
                        // Use live price if available, otherwise fall back to profile price
                        const currentPrice = holding?.price || holding?.profile?.price || 0;
                        const prevClose = holding?.profile?.price || 0;
                        
                        // Calculate change properly
                        let change = 0;
                        let changePercent = 0;
                        
                        if (holding?.profile?.changes) {
                            change = holding.profile.changes;
                            changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
                        } else if (currentPrice && prevClose && currentPrice !== prevClose) {
                            change = currentPrice - prevClose;
                            changePercent = (change / prevClose) * 100;
                        }
                        
                        return (
                            <HoldingCard
                                key={holding?.symbol}
                                symbol={holding?.symbol}
                                quantity={holding?.quantity}
                                avgPrice={holding?.avgPrice}
                                currentPrice={currentPrice}
                                logo={holding?.profile?.image}
                                prevClose={prevClose}
                                companyName={holding?.profile?.companyName}
                                price={currentPrice}
                                change={change.toString()}
                                changePercent={`${changePercent.toFixed(2)}%`}
                            />
                        );
                    })
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