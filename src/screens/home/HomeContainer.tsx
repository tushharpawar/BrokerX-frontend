import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import CustomView from '../../components/global/CustomView';
import HomeScreenTopTab from '../../navigation/HomeScreenTopTab';
import { useAppSelector, useAppDispatch } from '../../redux/reduxHook';
import { fetchStocks } from '../../redux/actions/stockAction';
import { getHoldingsAction } from '../../redux/actions/buyAction';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlatformConstants } from '../../utils/PlatformUtils';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';

const { height: screenHeight } = Dimensions.get('window');

const HomeContainer = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state?.user);
  const { stocks } = useAppSelector((state) => state.stocks);
  const { holdings } = useAppSelector((state: any) => state?.holdings);
  const insets = useSafeAreaInsets();

  // Calculate proper bottom padding for tab bar
  const tabBarHeight = Platform.OS === 'android' 
    ? 65 
    : 60 + (PlatformConstants.isIphoneX ? insets.bottom : 0);

  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      if (user?._id) {
        setIsLoading(true);
        try {
          await Promise.all([
            dispatch(fetchStocks()),
            dispatch(getHoldingsAction({ userId: user._id }))
          ]);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch, user?._id]);

  // Calculate portfolio value with safe defaults
  const totalPortfolioValue = holdings?.length > 0 ? holdings.reduce((total: number, holding: any) => {
    return total + (holding.quantity * (holding.price || holding.lastPrice || 0));
  }, 0) : 0;

  const totalInvestment = holdings?.length > 0 ? holdings.reduce((total: number, holding: any) => {
    return total + (holding.quantity * (holding.avgPrice || 0));
  }, 0) : 0;

  const totalPnL = totalPortfolioValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100) : 0;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchStocks());
      if (user?._id) {
        await dispatch(getHoldingsAction({ userId: user._id }));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <CustomSafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        stickyHeaderIndices={[1]} 
      >
        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'Trader'}</Text>
          </View>

          <View style={styles.portfolioSection}>
            <View style={styles.portfolioCard}>
              <Text style={styles.portfolioLabel}>Portfolio Value</Text>
              {isLoading ? (
                <Text style={styles.portfolioValue}>Loading...</Text>
              ) : (
                <Text style={styles.portfolioValue}>
                  ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              )}
              <View style={styles.pnlContainer}>
                {isLoading ? (
                  <Text style={[styles.pnlText, { color: Colors.grey2 }]}>
                    Calculating...
                  </Text>
                ) : (
                  <Text style={[styles.pnlText, { color: totalPnL >= 0 ? '#00C853' : '#FF5252' }]}>
                    {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                    ({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{isLoading ? '-' : stocks.length}</Text>
              <Text style={styles.statLabel}>Available Stocks</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="briefcase" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{isLoading ? '-' : holdings.length}</Text>
              <Text style={styles.statLabel}>Your Holdings</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="wallet" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>${user?.balance?.toFixed(2) || '0.00'}</Text>
              <Text style={styles.statLabel}>Available Balance</Text>
            </View>
          </View>
        </View>

        {/* Sticky Tab Bar */}
        <View style={styles.tabBarContainer}>
          <HomeScreenTopTab />
        </View>

        {/* Tab Content will be rendered inside the TabNavigator */}
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.grey1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 4,
  },
  portfolioSection: {
    marginBottom: 20,
  },
  portfolioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
  },
  portfolioLabel: {
    fontSize: 14,
    color: Colors.grey1,
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  pnlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pnlText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.grey2,
    marginTop: 2,
    textAlign: 'center',
  },
  tabBarContainer: {
    height: screenHeight,
    backgroundColor: Colors.background,
  },
});

export default HomeContainer;
