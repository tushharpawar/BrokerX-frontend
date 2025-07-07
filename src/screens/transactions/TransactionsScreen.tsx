import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView'
import { Colors } from '../../constants/Colors'
import { useAppSelector } from '../../redux/reduxHook'
import { fetchTransactionsAction } from '../../redux/actions/transactionAction'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface Transaction {
    _id: string;
    amount: number;
    type: 'ADD_FUNDS' | 'WITHDRAW' | 'ADJUSTMENT';
    description?: string;
    status: string;
    createdAt: string;
    balanceAfter?: number;
}

const TransactionsScreen = () => {
    const { user } = useAppSelector((state: any) => state.user);
    const navigation = useNavigation<any>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Transaction History',
            headerStyle: {
                backgroundColor: Colors.background,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    const fetchTransactions = async (cursor: string | null = null, isLoadMore = false) => {
        if (loading && !refreshing) return;
        
        if (!isLoadMore) {
            setLoading(true);
        }
        setError(null);

        try {
            const response = await fetchTransactionsAction({
                userId: user._id,
                cursor: cursor || ''
            });

            if (response.data && response.data.success) {
                const newTransactions = response.data.transactions || [];
                const pagination = response.data.pagination || {};

                if (isLoadMore) {
                    setTransactions(prev => [...prev, ...newTransactions]);
                } else {
                    setTransactions(newTransactions);
                }

                setHasNextPage(pagination.hasNextPage || false);
                setNextCursor(pagination.nextCursor || null);
            } else {
                setError('Failed to load transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transactions. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setNextCursor(null);
        setHasNextPage(true);
        fetchTransactions(null, false);
    }, [user._id]);

    const loadMoreTransactions = useCallback(() => {
        if (hasNextPage && !loading && nextCursor) {
            fetchTransactions(nextCursor, true);
        }
    }, [hasNextPage, loading, nextCursor]);

    useEffect(() => {
        if (user._id) {
            fetchTransactions();
        }
    }, [user._id]);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'ADD_FUNDS':
                return { name: 'add-circle', color: '#4CAF50' };
            case 'WITHDRAW':
                return { name: 'remove-circle', color: '#ff4d4f' };
            case 'ADJUSTMENT':
                return { name: 'settings', color: '#FFA726' };
            default:
                return { name: 'swap-horizontal', color: Colors.grey2 };
        }
    };

    const getTransactionTitle = (type: string) => {
        switch (type) {
            case 'ADD_FUNDS':
                return 'Funds Added';
            case 'WITHDRAW':
                return 'Withdrawal';
            case 'ADJUSTMENT':
                return 'Balance Adjustment';
            default:
                return 'Transaction';
        }
    };

    const getAmountColor = (type: string) => {
        switch (type) {
            case 'ADD_FUNDS':
                return '#4CAF50';
            case 'WITHDRAW':
                return '#ff4d4f';
            case 'ADJUSTMENT':
                return '#FFA726';
            default:
                return Colors.white;
        }
    };

    const getAmountPrefix = (type: string) => {
        switch (type) {
            case 'ADD_FUNDS':
                return '+';
            case 'WITHDRAW':
                return '-';
            default:
                return '';
        }
    };

    const renderTransactionItem = ({ item, index }: { item: Transaction; index: number }) => {
        const icon = getTransactionIcon(item.type);
        const amountColor = getAmountColor(item.type);
        const amountPrefix = getAmountPrefix(item.type);
        
        return (
            <View style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                    <View style={styles.transactionIconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: `${icon.color}20` }]}>
                            <Ionicons name={icon.name as any} size={24} color={icon.color} />
                        </View>
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionTitle}>
                                {getTransactionTitle(item.type)}
                            </Text>
                            {item.description && (
                                <Text style={styles.transactionDescription}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                        <Text style={[styles.transactionAmount, { color: amountColor }]}>
                            {amountPrefix}${Math.abs(item.amount).toFixed(2)}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.transactionFooter}>
                    <Text style={styles.transactionDate}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                    {item.balanceAfter && (
                        <Text style={styles.balanceAfter}>
                            Balance: ${item.balanceAfter.toFixed(2)}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderFooter = () => {
        if (!hasNextPage) return null;
        
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading more transactions...</Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerSubtitle}>
                {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </Text>
        </View>
    );

    const renderEmptyState = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color={Colors.grey3} />
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptyMessage}>
                    Your transaction history will appear here
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={onRefresh}>
                    <Text style={styles.emptyButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (error && transactions.length === 0 && !loading) {
        return (
            <CustomSafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={Colors.danger} />
                    <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchTransactions()}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </CustomSafeAreaView>
        );
    }

    return (
        <CustomSafeAreaView style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderTransactionItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreTransactions}
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
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={10}
                removeClippedSubviews={true}
            />
            
            {loading && transactions.length === 0 && (
                <View style={styles.initialLoader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading your transactions...</Text>
                </View>
            )}
        </CustomSafeAreaView>
    )
}

export default TransactionsScreen

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
    // Transaction Card Styles
    transactionCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.tabBorder,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    transactionIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 2,
    },
    transactionDescription: {
        fontSize: 12,
        color: Colors.grey2,
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    transactionStatus: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.tabBorder,
        paddingTop: 8,
    },
    transactionDate: {
        fontSize: 12,
        color: Colors.grey1,
    },
    balanceAfter: {
        fontSize: 12,
        color: Colors.grey2,
        fontWeight: '500',
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
