import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Colors } from '../../constants/Colors'
import { useAppSelector } from '../../redux/reduxHook'
import { fetchOrdersAction } from '../../redux/actions/orderAction'
import { useNavigation } from '@react-navigation/native'
import CustomView from '../../components/global/CustomView'

interface Order {
    _id: string;
    symbol: string;
    quantity: number;
    price: number;
    type: 'BUY' | 'SELL';
    status: string;
    createdAt: string;
    totalAmount: number;
}

const OrdersScreen = () => {
    const { user } = useAppSelector((state: any) => state.user);
    const navigation = useNavigation<any>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Set header options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Order History',
            headerStyle: {
                backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    const fetchOrders = async (cursor: string | null = null, isLoadMore = false) => {
        if (loading && !refreshing) return;
        
        if (!isLoadMore) {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await fetchOrdersAction({
                userId: user._id,
                cursor: cursor || ''
            });

            if (response.data && response.data.success) {
                const newOrders = response.data.orders || [];
                const pagination = response.data.pagination || {};

                if (isLoadMore) {
                    setOrders(prev => [...prev, ...newOrders]);
                } else {
                    setOrders(newOrders);
                }

                setHasNextPage(pagination.hasNextPage || false);
                setNextCursor(pagination.nextCursor || null);
            } else {
                setError('Failed to load orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setNextCursor(null);
        setHasNextPage(true);
        fetchOrders(null, false);
    }, [user._id]);

    const loadMoreOrders = useCallback(() => {
        if (hasNextPage && !loading && nextCursor) {
            fetchOrders(nextCursor, true);
        }
    }, [hasNextPage, loading, nextCursor]);

    useEffect(() => {
        if (user._id) {
            fetchOrders();
        }
    }, [user._id]);

    const renderOrderItem = ({ item, index }: { item: Order; index: number }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderSymbolContainer}>
                    <Text style={styles.orderSymbol}>{item.symbol}</Text>
                    <View style={[
                        styles.orderTypeBadge,
                        { backgroundColor: item.type === 'BUY' ? '#4CAF50' : '#ff4d4f' }
                    ]}>
                        <Text style={styles.orderTypeText}>{item.type}</Text>
                    </View>
                </View>
                <View style={styles.orderStatusContainer}>
                    <Text style={[
                        styles.orderStatus,
                        { color: item.status === 'COMPLETED' ? '#4CAF50' : '#FFA726' }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            
            <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Quantity</Text>
                    <Text style={styles.orderDetailValue}>{item.quantity}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Price</Text>
                    <Text style={styles.orderDetailValue}>${item.price?.toFixed(2)}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Total</Text>
                    <Text style={styles.orderDetailValue}>${(item?.price * item?.quantity).toFixed(2)}</Text>
                </View>
            </View>
            
            <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!hasNextPage) return null;
        
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading more orders...</Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </Text>
        </View>
    );

    const renderEmptyState = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Orders Yet</Text>
                <Text style={styles.emptyMessage}>
                    Start trading to see your order history here
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={onRefresh}>
                    <Text style={styles.emptyButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (error && orders.length === 0 && !loading) {
        return (
            <CustomView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders()}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </CustomView>
        );
    }

    return (
        <CustomView style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderOrderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreOrders}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                        progressBackgroundColor={Colors.surface}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
            />
            
            {loading && orders.length === 0 && (
                <View style={styles.initialLoader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading your orders...</Text>
                </View>
            )}
        </CustomView>
    )
}

export default OrdersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContainer: {
        paddingBottom: 60,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.tabBorder,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.grey1,
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    loadingText: {
        color: Colors.grey1,
        fontSize: 14,
    },
    initialLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        gap: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: Colors.grey1,
        textAlign: 'center',
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    retryButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    // Order Card Styles
    orderCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.tabBorder,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderSymbolContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    orderSymbol: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    orderTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    orderTypeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
    },
    orderStatusContainer: {
        alignItems: 'flex-end',
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    orderDetails: {
        gap: 8,
        marginBottom: 12,
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDetailLabel: {
        fontSize: 14,
        color: Colors.grey1,
    },
    orderDetailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    orderFooter: {
        borderTopWidth: 1,
        borderTopColor: Colors.tabBorder,
        paddingTop: 8,
        alignItems: 'flex-end',
    },
    orderDate: {
        fontSize: 12,
        color: Colors.grey1,
    },
    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 64,
        gap: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: Colors.grey1,
        textAlign: 'center',
        lineHeight: 24,
    },
    emptyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    emptyButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
})
