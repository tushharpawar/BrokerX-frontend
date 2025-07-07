import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import axios from 'axios'
import RazorpayCheckout from 'react-native-razorpay';
import { refetchUser } from '../../redux/actions/userAction'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Vibration } from 'react-native';
import { BASE_URL } from '../../redux/API';
import { RAZORPAY_KEY } from '@env';

export default function AddMoneyScreen() {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAppSelector((state) => state?.user);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();

    // Set header options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Add Money',
            headerStyle: {
                backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            dispatch(refetchUser());
        }, [dispatch])
    );

    const scale = useSharedValue(1);

    const animatedAmountStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const animateAmount = () => {
        scale.value = withSpring(1.05, {}, () => {
            scale.value = withTiming(1);
        });
    };

    const validateAmount = (value: any) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
            setError("Please enter a valid amount");
            return false;
        }
        if (numericValue > 100000) {
            setError("Amount cannot exceed $100,000");
            return false;
        }

        if (numericValue < 1) {
            setError("Amount must be at least $1");
            return false;
        }
        if (value.includes('.') && value.split('.')[1].length > 2) {
            setError("Amount cannot have more than two decimal places");
            return false;
        }
        if (value.length > 10) {
            setError("Amount is too long");
            return false;
        }
        if (value === "") {
            setError("Amount cannot be empty");
            return false;
        }
        if (value === "0") {
            setError("Amount cannot be zero");
            return false;
        }
        if (value.startsWith('.')) {
            setError("Amount cannot start with a decimal point");
            return false;
        }
        if (value.endsWith('.')) {
            setError("Amount cannot end with a decimal point");
            return false;
        }
        setError("");
        return true;
    }

    const handlePayment = async () => {

        if (!amount || amount.trim() === "") {
            Alert.alert("Amount required")
        }
        validateAmount(amount);
        setIsLoading(true);
        const values = {
            amount: parseFloat(amount),
        }
        try {
            const res = await axios.post(`${BASE_URL}/api/razorpay/create-order`, values
            )
            console.log("Response", res)
            const options = {
                description: 'Test Order',
                image: "https://res.cloudinary.com/ddprwohnl/image/upload/v1724407337/glitchover/uhtdofbij5srb8vhnbpl.jpg",
                currency: 'USD',
                key: RAZORPAY_KEY,
                amount: res.data.amount,
                order_id: res.data.id,
                name: 'StockX',
                prefill: {
                    email: user?.email || "",
                    contact: '+919876543210',
                    name: user?.fullName || "User Name",
                },
                theme: { color: Colors.primary },
            };

            res && options && RazorpayCheckout?.open(options)
                .then(async (paymentData) => {
                    try {
                        const response = await axios.post(`${BASE_URL}/api/razorpay/verify-order`, { ...paymentData, amount: values.amount, userId: user?._id })
                        console.log("Response after verification", response.data.success);
                        if (response.data.success) {
                            navigation.replace('BottomTab', { screen: 'Settings' });
                            dispatch(refetchUser())
                        }
                        setIsLoading(false);
                    } catch (error) {
                        setIsLoading(false);
                        console.log("Error in payment verification", error);
                    } finally {
                        setIsLoading(false);
                        setAmount("");
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log('Payment Failed', error);
                    Alert.alert('Error', error.description);
                });
        } catch (error) {
            setIsLoading(false);
            console.log("Error", error);
        } finally {
            setIsLoading(false);
            setAmount("");
        }
    }

    return (
        <CustomSafeAreaView>
            <View style={styles.container}>
                <View
                    style={{ width: "100%", height: "50%", alignItems: "center", justifyContent: "center" }}
                >
                    <View
                        style={{ width: "100%", alignItems: "center", justifyContent: "center", marginVertical: 20 }}
                    >
                        <Animated.Text style={[styles.amountDisplay, animatedAmountStyle]}>
                            ${amount || "0"}
                        </Animated.Text>
                        {error ? <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text> : null}
                    </View>
                    <View style={styles.suggestions}>
                        {[100, 500, 1000].map((val) => (
                            <TouchableOpacity key={val} style={styles.suggestionBtn} onPress={() => setAmount(val.toString())}>
                                <Text style={styles.suggestionText}>${val}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View
                    style={{ height: '50%', marginTop: 20, bottom: 10, position: 'absolute' }}
                >
                    <View style={styles.keypad}>
                        {[
                            ["1", "2", "3"],
                            ["4", "5", "6"],
                            ["7", "8", "9"],
                            [".", "0", "⌫"]
                        ].map((row, i) => (
                            <View key={i} style={styles.row}>
                                {row.map((key) => (
                                    <TouchableOpacity
                                        key={key}
                                        style={styles.key}
                                        onPress={() => {
                                            Vibration.vibrate(30);
                                            if (key === "⌫") {
                                                setAmount((prev) => prev.slice(0, -1));
                                            } else {
                                                const numericValue = parseFloat(amount + key);
                                                if (numericValue > 100000) return;
                                                setAmount((prev) => prev + key);
                                            }
                                            validateAmount(amount + key);
                                            animateAmount();
                                        }}
                                    >
                                        <Text style={styles.keyText}>{key}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View
                        style={{ width: "100%", paddingHorizontal: 15 }}
                    >
                        <TouchableOpacity
                            style={[{
                                backgroundColor: Colors.primary,
                                width: "100%",
                                paddingVertical: 15,
                                // paddingHorizontal: 30,
                                borderRadius: 10,
                                alignItems: "center",
                                // marginTop: 20,
                            }, error.length > 0 || amount.trim() == "" || amount == "0" ? { opacity: 0.3 } : {}]}
                            onPress={() => {
                                Vibration.vibrate(50);
                                if (validateAmount(amount)) {
                                    handlePayment();
                                }
                            }}

                            disabled={error.length > 0 || isLoading || amount.trim() == "" || amount == "0"}
                        >
                            <Text style={{ color: Colors.white, fontSize: 18, textAlign: 'center', fontWeight: 600, gap: 20, flexDirection: "row", alignItems: "center" }}>
                                <Text>{isLoading ? <ActivityIndicator size="small" color={Colors.white} /> : null}</Text>
                                {!isLoading && <Text>Add money</Text>}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomSafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: "100%",
        alignItems: "center",
        // justifyContent: "space-between",
        padding: 20,
    },
    suggestions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },
    suggestionBtn: {
        backgroundColor: Colors.cardBackground,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    suggestionText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    amountDisplay: {
        fontSize: 48,
        color: Colors.white,
        fontWeight: "600",
        marginBottom: 20,
    },
    keypad: {
        borderTopWidth: 1,
        borderTopColor: Colors.grey4,
        marginTop: 20,
    },
    row: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 5,
    },
    key: {
        width: "37%",
        height: 60,
        // paddingHorizontal: 50,
        // paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        // margin: 5,
        // backgroundColor: Colors.cardBackground,
    },
    keyText: {
        fontSize: 24,
        color: "white",
    },
});