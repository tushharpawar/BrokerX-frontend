import { Image, StyleSheet, Text, View, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import CustomView from '../../components/global/CustomView';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import MiniChart from '../../components/Stocks/MiniChart';
import useStockLivePrice from '../../hooks/StocksDetailsHooks/useStockLivePrice';
import { BASE_URL } from '../../redux/API';
import Overview from '../../components/Stocks/Overview';
import RangeBar from '../../components/Stocks/RangeBar';
import BuyButton from '../../components/Buy/BuyButton';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../redux/reduxHook';
import { checkIfUserOwnsStock, getUserHoldingForStock } from '../../utils/functions/holdingsHelper';

const TOKEN = 'ed0ff8bd51a44ef7b5a59c5014a890b1';

const StocksDetails = ({ route }: any) => {
    const [profile, setProfile] = useState<any>(null);
    const [financials, setFinancials] = useState<any>(null);
    const [showHeaderContent, setShowHeaderContent] = useState(false);
    const { stock } = route.params || {};
    const symbol = stock?.symbol;
    const navigation = useNavigation<any>();
    const scrollY = useRef(new Animated.Value(0)).current;
    const { holdings } = useAppSelector((state: any) => state?.holdings);
    const userOwnsStock = checkIfUserOwnsStock(holdings, symbol);
    const userHolding = getUserHoldingForStock(holdings, symbol);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(
                `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TOKEN}`,
            );

            if (res.data && !res.data.code) {
                setProfile(res.data);
            } else {
                console.error('Error in profile data:', res.data);
                setProfile(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
        }
    };

    const fetchFinancials = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/stock/financials?symbol=${symbol}`
            );
            if (res.data && !res.data.code) {
                setFinancials(res.data);
            } else {
                console.error('Error in financials data:', res.data);
                setFinancials(null);
            }
        }
        catch (error) {
            console.error('Error fetching financials:', error);
            setFinancials(null);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchFinancials();
    }, [symbol]);

    const previousClosePrice = stock?.prevClose || profile?.close;

    const { price } = useStockLivePrice(symbol);
    
    const currentPrice = price || stock?.price || previousClosePrice || 0;
    
    let change = 0;
    let changePercent = 0;
    
    if (stock?.change && stock?.changePercent) {
        // Use provided change data if available
        change = parseFloat(stock.change);
        changePercent = parseFloat(stock.changePercent.replace('%', ''));
    } else if (currentPrice && previousClosePrice && currentPrice !== previousClosePrice) {
        // Calculate change from current price and previous close
        change = currentPrice - previousClosePrice;
        changePercent = (change / previousClosePrice) * 100;
    }

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const shouldShowHeader = offsetY > 150;
                if (shouldShowHeader !== showHeaderContent) {
                    setShowHeaderContent(shouldShowHeader);
                }
            },
        }
    );

    useEffect(() => {
        navigation.setOptions({
            headerShown: showHeaderContent,
            headerTitle: () => showHeaderContent ? (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerCompanyName} numberOfLines={1}>
                        {stock.companyName}
                    </Text>
                    <View style={styles.headerPriceContainer}>
                        <Text style={styles.headerPrice}>
                            ${currentPrice.toFixed(2)}
                        </Text>
                        <Text style={[
                            styles.headerChange, 
                            { color: change < 0 ? '#ff4d4f' : '#4CAF50' }
                        ]}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                        </Text>
                    </View>
                </View>
            ) : undefined,
            headerStyle: {
                backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
        });
    }, [navigation, showHeaderContent, stock, currentPrice, change, changePercent]);

    const navigateToBuyScreen = () => {
        navigation.navigate('BuyScreen', { stock, headerShown: true });
    }

    const navigateToSellScreen = () => {
        navigation.navigate('SellScreen', { stock, holding: userHolding, headerShown: true });
    }

    return (
        <CustomSafeAreaView style={{ flex: 1,position: 'relative' }}>
            <Animated.ScrollView 
                showsHorizontalScrollIndicator={false} 
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <CustomView style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.leftContainer}>
                            <Image
                                source={{ uri: stock.logo }}
                                style={{ width: 45, height: 45, borderRadius: 16, marginRight: 8 }}
                            />
                            <View>
                                <Text style={styles.companyName}>{stock.companyName}</Text>
                                {userOwnsStock && (
                                    <Text style={styles.holdingIndicator}>
                                        You own {userHolding?.quantity} shares
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                                alignItems: 'center',
                            }}
                        >
                            <IonIcons name="alarm-outline" size={26} color={Colors.white} style={{ marginLeft: 10 }} />
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>${currentPrice.toFixed(2)}</Text>
                        <Text style={[styles.changeText, change < 0 ? { color: 'tomato' } : { color: 'limegreen' }]}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                        </Text>
                    </View>

                    <MiniChart symbol={symbol} color={change > 0 ? 'limegreen' : 'tomato'} />

                    <View>
                        <Text style={styles.title}>Performance</Text>
                        <Text style={[styles.label,{marginTop:5}]}>1D Range</Text>
                        <RangeBar low={profile?.low} high={profile?.high} current={currentPrice} />

                        <Text style={[styles.label,{marginTop:5}]}>52W Range</Text>
                        <RangeBar low={profile?.fifty_two_week.low} high={profile?.fifty_two_week.high} current={currentPrice} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                            <View>
                                <Text style={styles.label}>Open</Text>
                                <Text style={styles.text}>{profile?.open}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Close</Text>
                                <Text style={styles.text}>{profile?.close}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Volume</Text>
                                <Text style={styles.text}>{profile?.volume}</Text>
                            </View>
                        </View>
                    </View>

                    <Overview stockData={profile} financials={financials} />

                    <Text style={styles.title}>About Company</Text>
                    <View style={{ marginBottom: 100, marginTop:10,flexDirection: 'row',gap:20, alignItems: 'center' }}>
                           <View>
                                <Text style={styles.label}>Exchange</Text>
                                <Text style={styles.text}>{profile?.exchange}</Text>
                            </View> 
                            <View>
                                <Text style={styles.label}>Symbol</Text>
                                <Text style={styles.text}>{profile?.symbol}</Text>
                            </View>
                    </View>

                </CustomView>
            </Animated.ScrollView>
            <View style={{backgroundColor:Colors.background,paddingBottom: 10,borderTopWidth:1,borderTopColor:Colors.tabBorder ,paddingHorizontal: 10, position: 'absolute', bottom: 0, left: 0, right: 0}}>
                {userOwnsStock ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                            <BuyButton 
                                onPress={navigateToSellScreen} 
                                title="Sell" 
                                backgroundColor="#ff4d4f"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <BuyButton onPress={navigateToBuyScreen} title="Buy" />
                        </View>
                    </View>
                ) : (
                    // Show only Buy button when user doesn't own the stock
                    <BuyButton onPress={navigateToBuyScreen} />
                )}
            </View>
        </CustomSafeAreaView>
    )
}

export default StocksDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        // flexDirection: 'row',
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    holdingIndicator: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
        fontWeight: '500',
    },
    priceContainer: {
        marginTop: 20,
        padding: 10,
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
    },
    changeText: {
        fontSize: 16,
        color: 'limegreen',
        marginTop: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: Colors.white
    },
    label: {
        marginBottom: 4, color: '#888'
    },
    text: {
        // fontSize: 20,
        // fontWeight: 'bold',
        // marginTop: 16,
        // marginBottom: 8,
        color: Colors.white
    },
    headerContainer: {
        alignItems: 'center',
        // paddingHorizontal: 10,
    },
    headerCompanyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    headerPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    headerPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.grey1,
    },
    headerChange: {
        fontSize: 12,
        fontWeight: '500',
    },
})