import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
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
import { refetchUser } from '../../redux/actions/userAction'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Vibration } from 'react-native';
import { WITHDRAW_MONEY } from '../../redux/API';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WithdrawalData {
    success: boolean;
    amount: number;
    id: string;
    status: string;
    message?: string;
}

export default function WithdrawMoneyScreen() {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);
    const { user } = useAppSelector((state) => state?.user);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();

    const scale = useSharedValue(1);

    // Set header options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Withdraw Money',
            headerStyle: {
                backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    // Refresh user data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            dispatch(refetchUser());
        }, [dispatch])
    );

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
        if (numericValue > user?.balance) {
            setError("Insufficient balance");
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

    const handleWithdrawal = async () => {
        if (!amount || amount.trim() === "") {
            Alert.alert("Amount required")
            return;
        }
        
        if (!validateAmount(amount)) {
            return;
        }

        setIsLoading(true);
        const values = {
            amount: parseFloat(amount),
            userId: user?._id,
        }

        try {
            const response = await axios.post(WITHDRAW_MONEY, values);
            console.log("Withdrawal Response", response.data);
            
            if (response.data.success) {
                setWithdrawalData(response.data.transaction);
                setShowSuccessModal(true);
                setAmount("");
                
                // Add a small delay to ensure backend processing is complete
                setTimeout(() => {
                    dispatch(refetchUser()); // Update user balance
                }, 500);
            } else {
                Alert.alert('Error', response.data.message || 'Withdrawal failed');
            }
        } catch (error: any) {
            console.log("Withdrawal Error", error);
            Alert.alert('Error', error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setIsLoading(false);
        }
    }

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setWithdrawalData(null);
        // Refresh user data when modal closes
        dispatch(refetchUser());
    };

    const navigateToTransactions = () => {
        closeSuccessModal();
        navigation.navigate('TransactionsScreen');
    };

    const goBackToSettings = () => {
        closeSuccessModal();
        navigation.navigate('BottomTab', { screen: 'Settings' });
    };

    return (
        <CustomSafeAreaView>
            <View style={styles.container}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>${user?.balance?.toFixed(2) || "0.00"}</Text>
                </View>

                <View style={styles.amountContainer}>
                    <View style={styles.amountInputContainer}>
                        <Animated.Text style={[styles.amountDisplay, animatedAmountStyle]}>
                            ${amount || "0"}
                        </Animated.Text>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                    
                    <View style={styles.suggestions}>
                        {[50, 100, 500].map((val) => (
                            <TouchableOpacity 
                                key={val} 
                                style={styles.suggestionBtn} 
                                onPress={() => {
                                    if (val <= user?.balance) {
                                        setAmount(val.toString());
                                        validateAmount(val.toString());
                                    }
                                }}
                                disabled={val > user?.balance}
                            >
                                <Text style={[
                                    styles.suggestionText,
                                    { opacity: val > user?.balance ? 0.5 : 1 }
                                ]}>${val}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Custom NumPad */}
                <View style={styles.keypadContainer}>
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
                                                const newAmount = amount + key;
                                                const numericValue = parseFloat(newAmount);
                                                if (numericValue > user?.balance) return;
                                                setAmount(newAmount);
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

                    <View style={styles.withdrawButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.withdrawButton,
                                (error.length > 0 || amount.trim() === "" || amount === "0" || isLoading) && styles.withdrawButtonDisabled
                            ]}
                            onPress={() => {
                                Vibration.vibrate(50);
                                handleWithdrawal();
                            }}
                            disabled={error.length > 0 || isLoading || amount.trim() === "" || amount === "0"}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                        </View>
                        
                        <Text style={styles.successTitle}>Withdrawal Successful!</Text>
                        <Text style={styles.successMessage}>
                            ${withdrawalData?.amount?.toFixed(2)} has been withdrawn from your account.
                        </Text>
                        
                        <View style={styles.withdrawalDetails}>
                            <Text style={styles.detailText}>
                                Transaction ID: {withdrawalData?.id || 'N/A'}
                            </Text>
                            <Text style={styles.detailText}>
                                Status: {withdrawalData?.status || 'Completed'}
                            </Text>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.transactionButton} 
                                onPress={navigateToTransactions}
                            >
                                <Text style={styles.transactionButtonText}>View Transactions</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.closeButton} 
                                onPress={goBackToSettings}
                            >
                                <Text style={styles.closeButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    balanceContainer: {
        width: "100%",
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.tabBorder,
    },
    balanceLabel: {
        fontSize: 16,
        color: Colors.grey1,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        color: Colors.white,
        fontWeight: "bold",
    },
    amountContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    amountInputContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
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
    errorText: {
        color: '#ff4d4f',
        fontSize: 16,
        textAlign: 'center',
    },
    keypadContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'flex-end',
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
        alignItems: "center",
        justifyContent: "center",
    },
    keyText: {
        fontSize: 24,
        color: "white",
    },
    withdrawButtonContainer: {
        width: "100%",
        paddingHorizontal: 15,
        marginTop: 20,
    },
    withdrawButton: {
        backgroundColor: '#ff4d4f',
        width: "100%",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    withdrawButtonDisabled: {
        opacity: 0.3,
    },
    withdrawButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.surface,
        margin: 20,
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        width: '90%',
        borderWidth: 1,
        borderColor: Colors.tabBorder,
    },
    successIcon: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 12,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: Colors.grey1,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    withdrawalDetails: {
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginBottom: 24,
    },
    detailText: {
        fontSize: 14,
        color: Colors.grey1,
        marginBottom: 6,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    transactionButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    transactionButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.tabBorder,
    },
    closeButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
