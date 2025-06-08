import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomView from '../../components/global/CustomView';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import MiniChart from './MiniChart';
import { ScrollView } from 'react-native-gesture-handler';

const TOKEN = ''

const StocksDetails = ({ route }: any) => {
    const { stock } = route.params || {};
    const symbol = stock?.symbol;
    console.log("Stock Details:", stock);

    const [profile, setProfile] = useState(null);
    const [price, setPrice] = useState(null);

    // Fetch static profile info
    const fetchProfile = async () => {
        try {
            const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2`, {
                params: { symbol, token: TOKEN }
            });
            if (response.data) {
                setProfile(response.data);
            } else {
                console.error("No profile data found for symbol:", symbol);
                setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
        }
    }


    useEffect(() => {
        fetchProfile();
        // Open WebSocket connection for live price
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${TOKEN}`);
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "subscribe", symbol }));
        };
        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.type === "trade") {
                setPrice(msg.data[0]?.p); // current price
            }
        };
        return () => {
            ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
            ws.close();
        };
    }, [symbol]);


    console.log("Profile:", profile);
    console.log("Price:", price);

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
                        <Text style={styles.priceText}>${stock.price}</Text>
                        <Text style={styles.changeText}>+1.22 (3.22%)</Text>
                    </View>

                    <MiniChart symbol={symbol} />
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