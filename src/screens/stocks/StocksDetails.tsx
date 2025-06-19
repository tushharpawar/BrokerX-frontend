import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomView from '../../components/global/CustomView';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import MiniChart from '../../components/Stocks/MiniChart';
import { ScrollView } from 'react-native-gesture-handler';
import useStockLivePrice from '../../hooks/StocksDetailsHooks/useStockLivePrice';
import { BASE_URL } from '../../redux/API';
import Overview from '../../components/Stocks/Overview';
import RangeBar from '../../components/Stocks/RangeBar';
import BuyButton from '../../components/Stocks/BuyButton';

const TOKEN = 'ed0ff8bd51a44ef7b5a59c5014a890b1';

const StocksDetails = ({ route }: any) => {
    const [profile, setProfile] = useState<any>(null);
    const [financials, setFinancials] = useState<any>(null);
    const { stock } = route.params || {};
    const symbol = stock?.symbol;

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
    const change = price!  - previousClosePrice;
    const changePercent = (change / previousClosePrice) * 100;

    console.log("Profile data:", profile);
    console.log("Financials data:", financials);
    return (
        <CustomSafeAreaView style={{ flex: 1,position: 'relative' }}>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
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
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome name="bookmark-o" size={24} color={Colors.white} />
                            <IonIcons name="alarm-outline" size={26} color={Colors.white} style={{ marginLeft: 10 }} />
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>${price ? price : stock?.price}</Text>
                        <Text style={[styles.changeText, change < 0 ? { color: 'tomato' } : { color: 'limegreen' }]}>{change ? change.toFixed(2) : stock?.change} ({changePercent ? changePercent.toFixed(2) : stock?.changePercent}%)</Text>
                    </View>

                    <MiniChart symbol={symbol} color={change > 0 ? 'limegreen' : 'tomato'} />

                    <View>
                        <Text style={styles.title}>Performance</Text>
                        <Text style={[styles.label,{marginTop:5}]}>1D Range</Text>
                        <RangeBar low={profile?.low} high={profile?.high} current={price ? price : stock?.price} />

                        <Text style={[styles.label,{marginTop:5}]}>52W Range</Text>
                        <RangeBar low={profile?.fifty_two_week.low} high={profile?.fifty_two_week.high} current={price ? price : stock?.price} />

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
            </ScrollView>
            <View style={{marginBottom: 10, marginHorizontal: 10, position: 'absolute', bottom: 0, left: 0, right: 0}}>
                <BuyButton/>
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
    }
})