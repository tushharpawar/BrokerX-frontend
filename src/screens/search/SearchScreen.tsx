import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import CustomView from '../../components/global/CustomView';
import { Colors } from '../../constants/Colors';
import { SEARCH_STOCKS } from '../../redux/API';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StockItem {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
  logo?: string;
  price?: number;
  change?: string;
  changePercent?: string;
  prevClose?: number;
  companyName?: string;
}

const SearchScreen: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigation = useNavigation<any>();

  // Debounce search function
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchStocks(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const searchStocks = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${SEARCH_STOCKS}?query=${query}&limit=5`);
      console.log("response", response);
      if (response.data && Array.isArray(response.data.suggestions)) {
        setSearchResults(response.data.suggestions);
        setShowResults(true);
      } else if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data);
        setShowResults(true);
      }
    } catch (error: any) {
      console.error('Error searching stocks:', error);
      Alert.alert('Error', 'Failed to search stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStockPress = (stock: StockItem) => {
    // Add to recent searches
    const updatedRecentSearches = [stock.symbol, ...recentSearches.filter(s => s !== stock.symbol)].slice(0, 5);
    setRecentSearches(updatedRecentSearches);
    
    // Prepare stock data with proper price calculations
    const currentPrice = stock.price || stock.prevClose || 0;
    const prevClose = stock.prevClose || 0;
    
    let change = 0;
    let changePercent = '0%';
    
    if (stock.change && stock.changePercent) {
      change = parseFloat(stock.change);
      changePercent = stock.changePercent;
    } else if (currentPrice && prevClose && currentPrice !== prevClose) {
      change = currentPrice - prevClose;
      const changePercentValue = (change / prevClose) * 100;
      changePercent = `${changePercentValue.toFixed(2)}%`;
    }
    
    const stockData = {
      symbol: stock.symbol || stock.displaySymbol,
      companyName: stock.description || stock.companyName,
      price: currentPrice,
      change: change.toString(),
      logo: stock.logo || '',
      prevClose: prevClose,
      changePercent: changePercent
    };
    
    navigation.navigate('StocksDetails', { stock: stockData });
    
    // Clear search
    setSearchQuery('');
    setShowResults(false);
    Keyboard.dismiss();
  };

  const handleRecentSearchPress = (symbol: string) => {
    setSearchQuery(symbol);
    searchStocks(symbol);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    Keyboard.dismiss();
  };

  const renderStockItem = ({ item }: { item: StockItem }) => {
    // Use price from item if available, otherwise use prevClose
    const currentPrice = item.price || item.prevClose || 0;
    const prevClose = item.prevClose || 0;
    
    // Calculate change and change percentage
    let change = 0;
    let changePercent = '0%';
    let isPositive = true;
    
    if (item.change && item.changePercent) {
      // Use provided change data if available
      change = parseFloat(item.change);
      changePercent = item.changePercent;
      isPositive = change >= 0;
    } else if (currentPrice && prevClose && currentPrice !== prevClose) {
      // Calculate change from current price and previous close
      change = currentPrice - prevClose;
      const changePercentValue = (change / prevClose) * 100;
      changePercent = `${changePercentValue.toFixed(2)}%`;
      isPositive = change >= 0;
    }
    
    const hasPrice = currentPrice > 0;
    const hasChange = Math.abs(change) > 0;
    
    return (
      <TouchableOpacity 
        style={styles.stockItem} 
        onPress={() => handleStockPress(item)}
      >
        {/* Header with logo, symbol and price change */}
        <View style={styles.stockHeader}>
          <View style={styles.stockHeaderLeft}>
            {item.logo && (
              <Image 
                source={{ uri: item.logo }} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.stockTitleContainer}>
              <View style={styles.symbolContainer}>
                <Text style={styles.symbol}>{item.symbol || item.displaySymbol}</Text>
                {item.type && (
                  <View style={styles.typeContainer}>
                    <Text style={styles.type}>{item.type}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.companyName} numberOfLines={1}>
                {item.description || item.companyName}
              </Text>
            </View>
          </View>
          
          {hasPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
              {hasChange && (
                <Text style={[styles.change, { color: isPositive ? '#00C853' : '#FF5252' }]}>
                  {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent})
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Additional data row */}
        {(hasPrice || prevClose > 0) && (
          <View style={styles.stockDataRow}>
            {prevClose > 0 && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Prev Close</Text>
                <Text style={styles.dataValue}>${prevClose.toFixed(2)}</Text>
              </View>
            )}
            {hasPrice && (
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Current</Text>
                <Text style={styles.dataValue}>${currentPrice.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={20} color={Colors.grey2} />
            </View>
          </View>
        )}

        {/* Simple layout for items without price data */}
        {!hasPrice && prevClose <= 0 && (
          <View style={styles.simpleStockFooter}>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey2} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.recentItem} onPress={() => handleRecentSearchPress(item)}>
      <Ionicons name="time-outline" size={20} color={Colors.grey2} style={styles.recentIcon} />
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

  const handlePopularStockPress = (symbol: string) => {
    setSearchQuery(symbol);
    searchStocks(symbol);
  };

  const renderPopularStock = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.popularStock} onPress={() => handlePopularStockPress(item)}>
      <Text style={styles.popularStockText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <CustomView>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Search Stocks</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.grey2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks, symbols..."
            placeholderTextColor={Colors.grey2}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.grey2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              renderItem={renderStockItem}
              keyExtractor={(item) => item.symbol || item.displaySymbol}
              showsVerticalScrollIndicator={false}
              style={styles.resultsList}
            />
          </View>
        )}

        {/* No Results */}
        {showResults && searchResults.length === 0 && !loading && searchQuery.length > 1 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.grey2} />
            <Text style={styles.noResultsText}>No stocks found</Text>
            <Text style={styles.noResultsSubText}>Try searching with a different symbol or company name</Text>
          </View>
        )}

        {/* Recent Searches */}
        {!showResults && recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearchItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Popular Stocks */}
        {!showResults && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Stocks</Text>
            <FlatList
              data={popularStocks}
              renderItem={renderPopularStock}
              keyExtractor={(item) => item}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.popularRow}
            />
          </View>
        )}
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: Colors.grey1,
    marginLeft: 10,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 16,
  },
  stockItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stockHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.cardBackground,
  },
  stockTitleContainer: {
    flex: 1,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  typeContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  type: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: '500',
  },
  companyName: {
    fontSize: 13,
    color: Colors.grey1,
    lineHeight: 18,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 2,
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
  stockDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBorder,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 11,
    color: Colors.grey2,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.white,
  },
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  simpleStockFooter: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  stockInfo: {
    flex: 1,
  },
  stockItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.grey1,
    lineHeight: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
    color: Colors.grey1,
  },
  section: {
    marginBottom: 24,
  },
  popularRow: {
    justifyContent: 'space-between',
  },
  popularStock: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
    minWidth: '22%',
    alignItems: 'center',
  },
  popularStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: Colors.grey1,
    marginTop: 16,
    fontWeight: '500',
  },
  noResultsSubText: {
    fontSize: 14,
    color: Colors.grey2,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SearchScreen;