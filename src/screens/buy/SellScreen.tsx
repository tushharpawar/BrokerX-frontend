import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import BuyButton from '../../components/Buy/BuyButton'
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook'
import { s } from 'react-native-size-matters'
import useStockLivePrice from '../../hooks/StocksDetailsHooks/useStockLivePrice'
import { sellHoldingsAction } from '../../redux/actions/sellAction'
import { getHoldingsAction } from '../../redux/actions/buyAction'
import { refetchUser } from '../../redux/actions/userAction'

const SellScreen = ({ route, navigation }: any) => {
    const { stock, holding } = route.params || {};
    const { user } = useAppSelector((state: any) => state.user);
    const dispatch = useAppDispatch();
    const [atMarketPrice, setMarketPrice] = useState(true);
    const [quantity, setQuantity] = useState<any>();
    const [error, setError] = useState<any>(null);
    const [isQuantityError, setIsQuantityError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { price } = useStockLivePrice(stock.symbol);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerContainer}>
                    <Text style={styles.symbolText}>{stock.companyName}</Text>
                    <Text style={styles.priceText}>${parseFloat(price ? price : stock.price).toFixed(2)}</Text>
                </View>
            ),
        });
    }, [stock, navigation, price]);

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
        
        if (numericValueAsNumber > holding?.quantity) {
            setError(`You only own ${holding?.quantity} shares`);
            setIsQuantityError(true);
            setQuantity(text);
            return;
        }
        
        setIsQuantityError(false);
    };

    const sellHoldings = async () => {
        if (error && error.length > 0) {
            return;
        }
        if (!quantity || quantity <= 0) {
            setError('Please enter a valid quantity');
            setIsQuantityError(true);
            return;
        }

        setIsLoading(true);
        const values = {
            userId: user._id,
            symbol: stock.symbol,
            quantity: parseInt(quantity, 10),
            price: atMarketPrice ? stock.price : parseFloat(stock.price).toFixed(2),
        }
        
        try {
            const res = await sellHoldingsAction(values);
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
            console.error('Error during sell action:', error);
            setError('Failed to sell stock. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CustomSafeAreaView>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                }}
            >
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Delivery</Text>
                </TouchableOpacity>
            </View>

            <View style={{
                backgroundColor: Colors.cardBackground,
                margin: 10,
                borderRadius: 12,
                paddingVertical:12,
                paddingHorizontal: 14,
                borderWidth: 1,
                borderColor: Colors.tabBorder,
            }}>
                <Text style={styles.sectionTitle}>Current Holdings</Text>
                
                {/* Stock Info Row */}
                {/* <View style={styles.stockInfoRow}>
                    <View style={styles.stockInfo}>
                        <Text style={styles.stockSymbol}>{stock?.symbol}</Text>
                        <Text style={styles.stockName}>{stock?.companyName}</Text>
                    </View>
                    <View style={styles.currentPriceContainer}>
                        <Text style={styles.currentPriceLabel}>Current Price</Text>
                        <Text style={styles.currentPrice}>${(price || stock?.price)?.toFixed(2)}</Text>
                    </View>
                </View> */}

                <View style={styles.divider} />

                {/* Holdings Details */}
                <View style={styles.holdingsGrid}>
                    <View style={styles.holdingItem}>
                        <Text style={styles.holdingLabel}>Quantity</Text>
                        <Text style={styles.holdingValue}>{holding?.quantity}</Text>
                        <Text style={styles.holdingSubtext}>shares</Text>
                    </View>
                    
                    <View style={styles.holdingItem}>
                        <Text style={styles.holdingLabel}>Avg Price</Text>
                        <Text style={styles.holdingValue}>${holding?.avgPrice?.toFixed(2)}</Text>
                        <Text style={styles.holdingSubtext}>per share</Text>
                    </View>
                </View>

                <View style={styles.holdingsGrid}>
                    <View style={styles.holdingItem}>
                        <Text style={styles.holdingLabel}>Invested</Text>
                        <Text style={styles.holdingValue}>${(holding?.quantity * holding?.avgPrice)?.toFixed(2)}</Text>
                        <Text style={styles.holdingSubtext}>total cost</Text>
                    </View>
                    
                    <View style={styles.holdingItem}>
                        <Text style={styles.holdingLabel}>Current Value</Text>
                        <Text style={styles.holdingValue}>${(holding?.quantity * (price || stock?.price))?.toFixed(2)}</Text>
                        <Text style={styles.holdingSubtext}>market value</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* P&L Section */}
                <View style={styles.pnlContainer}>
                    <View style={styles.pnlRow}>
                        <Text style={styles.pnlLabel}>Total P&L</Text>
                        <View style={styles.pnlValues}>
                            <Text style={[
                                styles.pnlAmount, 
                                { color: (holding?.quantity * (price || stock?.price) - holding?.quantity * holding?.avgPrice) >= 0 ? '#4CAF50' : '#ff4d4f' }
                            ]}>
                                {(holding?.quantity * (price || stock?.price) - holding?.quantity * holding?.avgPrice) >= 0 ? '+' : ''}
                                ${((holding?.quantity * (price || stock?.price)) - (holding?.quantity * holding?.avgPrice))?.toFixed(2)}
                            </Text>
                            <Text style={[
                                styles.pnlPercentage,
                                { color: (holding?.quantity * (price || stock?.price) - holding?.quantity * holding?.avgPrice) >= 0 ? '#4CAF50' : '#ff4d4f' }
                            ]}>
                                ({(((price || stock?.price) - holding?.avgPrice) / holding?.avgPrice * 100)?.toFixed(2)}%)
                            </Text>
                        </View>
                    </View>
                </View>
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
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                        style={[styles.textInput, isQuantityError && { backgroundColor: 'rgba(255, 85, 85, 0.15)', borderColor: 'rgba(255, 85, 85, 0.3)', color: '#ff6b6b' }]}
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        placeholder="0"
                        placeholderTextColor="#888"
                    />
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
                    {atMarketPrice ? (
                        <TouchableOpacity onPress={() => setMarketPrice(true)} style={styles.marketPriceButton}>
                            <Text style={styles.marketPriceText}>At Market</Text>
                        </TouchableOpacity>
                    ) : (
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder="0.00"
                            placeholderTextColor="#888"
                        />
                    )}
                </View>
            </View>

            {error && error.length > 0 && (
                <View style={{ 
                    padding: 10, 
                    backgroundColor: 'rgba(255, 85, 85, 0.15)', 
                    borderRadius: 8, 
                    marginHorizontal: 10, 
                    marginBottom: 10, 
                    position: 'absolute', 
                    bottom: 150, 
                    left: 0, 
                    right: 0 
                }}>
                    <Text style={{ color: '#ff6b6b', fontSize: s(14), textAlign: 'center' }}>{error}</Text>
                </View>
            )}

            <View style={{ marginBottom: 10, marginHorizontal: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                }}>
                    <Text style={styles.balanceText}>Available: <Text>{holding?.quantity} shares</Text></Text>
                    <Text style={styles.balanceText}>
                        Estimated Return: {quantity > 0 && <Text>${quantity > 0 ? (quantity * (price || stock.price)).toFixed(2) : null}</Text>}
                    </Text>
                </View>
                <BuyButton 
                    onPress={sellHoldings} 
                    error={error} 
                    title="Sell" 
                    backgroundColor="#ff4d4f"
                    isLoading={isLoading}
                />
            </View>
        </CustomSafeAreaView>
    )
}

export default SellScreen

const styles = StyleSheet.create({
    headerContainer: {
        // paddingVertical: 10,
        // paddingHorizontal: 14,
    },
    symbolText: {
        fontSize: 16,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 12,
    },
    stockInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    stockInfo: {
        flex: 1,
    },
    stockSymbol: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    stockName: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    currentPriceContainer: {
        alignItems: 'flex-end',
    },
    currentPriceLabel: {
        fontSize: 12,
        color: '#888',
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.tabBorder,
        // marginVertical: 6,
    },
    holdingsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    holdingItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
    },
    holdingLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    holdingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 2,
    },
    holdingSubtext: {
        fontSize: 10,
        color: '#666',
    },
    pnlContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pnlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pnlLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    pnlValues: {
        alignItems: 'flex-end',
    },
    pnlAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pnlPercentage: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
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
        textAlign: 'right'
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
});