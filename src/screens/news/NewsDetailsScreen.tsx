import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
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

const NewsDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { newsItem } = route.params as { newsItem: NewsItem };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'News Details',
      headerStyle: {
        backgroundColor: Colors.background,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReadMore = async () => {
    try {
      const supported = await Linking.canOpenURL(newsItem.url);
      if (supported) {
        await Linking.openURL(newsItem.url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  return (
    <CustomSafeAreaView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {newsItem.image && (
          <Image source={{ uri: newsItem.image }} style={styles.newsImage} />
        )}
        
        <View style={styles.contentContainer}>
          <View style={styles.metaContainer}>
            <Text style={styles.source}>{newsItem.source}</Text>
            <Text style={styles.date}>{formatDate(newsItem.datetime)}</Text>
          </View>

          <Text style={styles.headline}>{newsItem.headline}</Text>
          
          {newsItem.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{newsItem.category.toUpperCase()}</Text>
            </View>
          )}

          <Text style={styles.summary}>{newsItem.summary}</Text>

          <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
            <Ionicons name="open-outline" size={20} color={Colors.white} />
            <Text style={styles.readMoreText}>Read Full Article</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  newsImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  source: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: Colors.grey1,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 15,
    lineHeight: 32,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 15,
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  summary: {
    fontSize: 16,
    color: Colors.grey1,
    lineHeight: 24,
    marginBottom: 30,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  readMoreText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default NewsDetailsScreen;
