import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import CustomView from '../../components/global/CustomView';
import { Colors } from '../../constants/Colors';
import { GET_GENERAL_NEWS, GET_TRENDING_NEWS } from '../../redux/API';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  datetime: number;
  category?: string;
}

const NewsScreen: FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'trending'>('general');
  const [generalNews, setGeneralNews] = useState<NewsItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [generalResponse, trendingResponse] = await Promise.all([
        axios.get(`${GET_GENERAL_NEWS}?category=general&limit=20`),
        axios.get(`${GET_TRENDING_NEWS}?limit=10`),
      ]);

      if (generalResponse.data && Array.isArray(generalResponse.data.news)) {
        setGeneralNews(generalResponse.data.news);
      }
      if (trendingResponse.data && Array.isArray(trendingResponse.data.news)) {
        setTrendingNews(trendingResponse.data.news);
      }
    } catch (error: any) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetailsScreen', { newsItem });
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.newsCard} onPress={() => handleNewsPress(item)}>
      <View style={styles.newsContent}>
        <View style={[styles.newsTextContainer, !item.image && styles.newsTextContainerFull]}>
          <View style={styles.newsHeader}>
            <Text style={styles.source}>{item.source}</Text>
            <Text style={styles.time}>{formatDate(item.datetime)}</Text>
          </View>
          <Text style={styles.headline} numberOfLines={3}>
            {item.headline}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {item.summary}
          </Text>
        </View>
        {item.image && (
          <Image 
            source={{ uri: item.image }} 
            style={styles.newsImage}
          />
        )}
      </View>
      <View style={styles.readMoreContainer}>
        <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  const currentNews = activeTab === 'general' ? generalNews : trendingNews;

  return (
    <CustomView>
      <View style={styles.container}>
        <Text style={styles.title}>News</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'general' && styles.activeTab]}
            onPress={() => setActiveTab('general')}
          >
            <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>
              General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
            onPress={() => setActiveTab('trending')}
          >
            <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
              Trending
            </Text>
          </TouchableOpacity>
        </View>

        {/* News List */}
        {loading && currentNews.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        ) : (
          <FlatList
            data={currentNews}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id || item.url}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={64} color={Colors.grey2} />
                <Text style={styles.emptyText}>No news available</Text>
                <Text style={styles.emptySubText}>Pull down to refresh</Text>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.grey1,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  newsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.tabBorder,
  },
  newsContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  newsTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  newsTextContainerFull: {
    marginRight: 0,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 12,
    color: Colors.grey2,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 8,
    lineHeight: 22,
  },
  summary: {
    fontSize: 14,
    color: Colors.grey1,
    lineHeight: 20,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  readMore: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.grey1,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.grey1,
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.grey2,
    marginTop: 8,
  },
});

export default NewsScreen;