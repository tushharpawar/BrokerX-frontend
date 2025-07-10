import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import BuyButton from '../../components/Buy/BuyButton'
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook'
import { s } from 'react-native-size-matters'
import { buyHoldingsAction, getHoldingsAction } from '../../redux/actions/buyAction'
import { refetchUser } from '../../redux/actions/userAction'
import useStockLivePrice from '../../hooks/StocksDetailsHooks/useStockLivePrice'
import CustomView from '../../components/global/CustomView'

const BuyScreen = ({ route, navigation }: any) => {
    const { stock } = route.params || {};
    const {user} = useAppSelector((state:any) => state.user);
    const dispatch = useAppDispatch();
    const [atMarketPrice, setMarketPrice] = useState(true);
    const [quantity, setQuantity] = useState<any>();
    const [error,setError] = useState<any>(null);
    const [isQuantityError, setIsQuantityError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { price } = useStockLivePrice(stock.symbol)

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerContainer}>
                    <Text style={styles.symbolText}>{stock.companyName}</Text>
                    <Text style={styles.priceText}>${parseFloat(price ? price : stock.price).toFixed(2)}</Text>
                </View>
            ),
        });
    }, [stock, navigation,price]);

    const handleQuantityChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setError(null);
        setIsQuantityError(false);
        setQuantity('');
        if (numericValue === '') {
            setError('Quantity cannot be empty');
            setIsQuantityError(true);
            return;
        }
        setQuantity(numericValue);
        const numericValueAsNumber = parseInt(numericValue, 10);
        if (isNaN(numericValueAsNumber) || numericValueAsNumber <= 0) {
            setError('Please enter a valid quantity');
            setIsQuantityError(true);
            setQuantity('');
            return;
        }
        if (numericValueAsNumber > user.balance / stock.price) {
            setError('Insufficient balance');
            setIsQuantityError(true);
            setQuantity(text);
            return;
        }
        setIsQuantityError(false);
    };

    const buyHoldings = async () =>{
        if(error && error.length > 0){
            return;
        }
        if(!quantity || quantity <= 0){
            setError('Please enter a valid quantity');
            setIsQuantityError(true);
            return;
        }

        setIsLoading(true);
        const values = {
            userId:user._id,
            symbol:stock.symbol,
            quantity: parseInt(quantity, 10),
            price: atMarketPrice ? stock.price : parseFloat(stock.price).toFixed(2),
        }
        
        try {
            const res = await buyHoldingsAction(values);
            console.log("Buy action response:", res);
            
            // Refresh user data and holdings after successful purchase
            await dispatch(refetchUser());
            await dispatch(getHoldingsAction({ userId: user._id }));
            
            navigation.navigate('BottomTab', { 
                screen: 'Home',
                params: {
                    screen: 'Holdings'
                }
            });
            setQuantity('');
            setMarketPrice(true);
            setError(null);
        } catch (error) {
            console.error('Error during buy action:', error);
            setError('Failed to purchase stock. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CustomView>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                }}
            >
                <TouchableOpacity style={styles.filterButton} >
                    <Text style={styles.filterText}>Delivery</Text>
                </TouchableOpacity>
            </View>

            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    margin: 4,
                }}>
                    <Text style={[styles.label]}>Quantity</Text>
                    <TextInput
                        style={[styles.textInput,isQuantityError&&{backgroundColor:'rgba(255, 85, 85, 0.15)',borderColor: 'rgba(255, 85, 85, 0.3)',color: '#ff6b6b'}]}
                        keyboardType='numeric'
                        onChangeText={handleQuantityChange}
                    >
                    </TextInput>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    margin: 4,
                }}>
                    <Text style={styles.label}>Price</Text>
                    {
                        atMarketPrice ? (
                            <TouchableOpacity onPress={() => setMarketPrice(true)} style={styles.marketPriceButton}>
                                <Text style={styles.marketPriceText}>At Market</Text>
                            </TouchableOpacity>
                        ) : (
                            <TextInput
                                style={styles.textInput}
                                keyboardType='numeric'
                                autoFocus={true}
                            >
                            </TextInput>
                        )
                    }
                </View>
            </View>

            {
                error && error.length > 0 && (
                    <View style={{ padding: 10, backgroundColor: 'rgba(255, 85, 85, 0.15)', borderRadius: 8, marginHorizontal: 10,marginBottom: 10, position: 'absolute', bottom: 150, left: 0, right: 0 }}>
                        <Text style={{ color: '#ff6b6b', fontSize: s(14),textAlign:'center' }}>{error}</Text>
                    </View>
                )
            }

            <View style={{marginBottom: 10, marginHorizontal: 10, position: 'absolute', bottom: 0, left: 0, right: 0}}>
                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                    }}
                    >
                        <Text style={styles.balanceText}>Balance: <Text>${user.balance.toFixed(2)}</Text></Text>
                        <Text style={styles.balanceText}>Required: {quantity > 0 && <Text>${quantity > 0 ? (quantity * stock.price).toFixed(2):null}</Text>}</Text>
                    </View>
                <BuyButton onPress={buyHoldings} error={error} isLoading={isLoading}/>
            </View>
        </CustomView>
    )
}

export default BuyScreen

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    symbolText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 14,
        color: '#ccc',
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 18,
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    filterText: {
        color: Colors.white,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
    },
    textInput: {
        height: 42,
        width: '33%',
        backgroundColor: Colors.cardBackground,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: Colors.white,
        fontSize: 16,
        textAlign:'right'
    },
    marketPriceButton: {
        height: 42,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '33%',
        backgroundColor: Colors.cardBackground,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    marketPriceText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
    balanceText: {
        fontSize: 14,
        color: Colors.grey1,
        marginBottom: 8,
    },
})