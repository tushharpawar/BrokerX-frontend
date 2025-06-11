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

const TOKEN = 'ed0ff8bd51a44ef7b5a59c5014a890b1';

const StocksDetails = ({ route }: any) => {
    const [profile, setProfile] = useState<any>(null);
    const [financials,setFinancials] = useState<any>(null);
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
            console.log("Financials response:", res.data);
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

    const previousClosePrice = stock?.prevClose || 0;

    const {price} = useStockLivePrice(symbol);
    const change = price! - previousClosePrice;
    const changePercent = (change / previousClosePrice) * 100;

    return (
        <CustomSafeAreaView>
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
                        <Text style={[styles.changeText,change < 0 ? {color:'tomato'}:{color:'limegreen'}]}>{change ? change.toFixed(2):stock?.change} ({changePercent?changePercent.toFixed(2):stock?.changePercent}%)</Text>
                    </View>
                            
                    {price && <MiniChart symbol={symbol} color={change > 0 ? 'limegreen':'tomato'}/>}


                </CustomView>
            </ScrollView>
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
})