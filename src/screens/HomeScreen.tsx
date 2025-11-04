import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  Animated,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Card, LoadingStates } from '@components/common';
import { theme } from '@theme/index';
import {
  fetchRestaurants,
  fetchCategories,
  fetchFeatured,
  fetchTrending,
} from '@store/slices/restaurantSlice';
import { RootState } from '@store/index';
import { formatCurrency, formatTime } from '@utils/index';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    restaurants,
    categories,
    featured,
    trending,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.restaurant);

  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState('San Francisco, CA');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchFeatured()),
        dispatch(fetchTrending()),
        dispatch(fetchRestaurants({ page: 1, limit: 10 })),
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    handleRefresh();
  };

  const handleRestaurantPress = (restaurantId: string) => {
    navigation.navigate('Restaurant' as never, { restaurantId });
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate('Search' as never, { filters: { cuisine: [category] } });
  };

  const handleLocationPress = () => {
    // Open location picker
    Alert.alert('Location', 'Location picker would open here');
  };

  const handleSearch = () => {
    navigation.navigate('Search' as never);
  };

  const { colors, spacing } = theme;

  // Animate header based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 60],
    extrapolate: 'clamp',
  });

  // Render location header
  const renderLocationHeader = () => (
    <Animated.View style={[styles.locationHeader, { opacity: headerOpacity }]}>
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={handleLocationPress}
      >
        <Icon name="location-outline" size={16} color={colors.septenary} />
        <View style={styles.locationTextContainer}>
          <Text style={[styles.locationText, { color: colors.text }]}>
            Deliver to
          </Text>
          <View style={styles.locationRow}>
            <Text style={[styles.locationValue, { color: colors.septenary }]}>
              {location}
            </Text>
            <Icon name="chevron-down" size={14} color={colors.septenary} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileButton}>
        <Icon name="person-circle-outline" size={28} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render search bar
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={handleSearch}
        activeOpacity={0.8}
      >
        <Icon
          name="search-outline"
          size={20}
          color={colors.textTertiary}
          style={styles.searchIcon}
        />
        <Text style={[styles.searchPlaceholder, { color: colors.textTertiary }]}>
          Search for restaurants, dishes...
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render category chips
  const renderCategoryChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryChip}
      onPress={() => handleCategoryPress(item.name)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render restaurant card
  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.restaurantImageContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
          style={styles.restaurantImageOverlay}
        />
        <Text style={styles.restaurantImagePlaceholder}>
          <Icon name="restaurant" size={40} color={colors.textTertiary} />
        </Text>
      </View>

      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text
            style={[styles.restaurantName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={12} color={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {item.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              ({item.reviewCount})
            </Text>
          </View>
        </View>

        <View style={styles.restaurantDetails}>
          <View style={styles.cuisineTags}>
            {item.cuisine.slice(0, 2).map((cuisine: string, index: number) => (
              <View key={index} style={styles.cuisineTag}>
                <Text style={[styles.cuisineText, { color: colors.textSecondary }]}>
                  {cuisine}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <Icon
                name="time-outline"
                size={14}
                color={colors.textSecondary}
                style={styles.metaIcon}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.deliveryTime.min}-{item.deliveryTime.max} min
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon
                name="bicycle-outline"
                size={14}
                color={colors.textSecondary}
                style={styles.metaIcon}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatCurrency(item.deliveryFee)}
              </Text>
            </View>

            <View style={styles.priceRange}>
              <Text style={[styles.priceRangeText, { color: colors.textSecondary }]}>
                {'$'.repeat(item.priceRange)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render trending carousel
  const renderTrendingSection = () => {
    if (trending.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🔥 Trending Near You
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.septenary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={trending}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>
    );
  };

  // Render featured section
  const renderFeaturedSection = () => {
    if (featured.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ⭐ Featured Restaurants
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.septenary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={featured}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>
    );
  };

  // Render categories section
  const renderCategoriesSection = () => {
    if (categories.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesListContent}
        />
      </View>
    );
  };

  // Render recommended section
  const renderRecommendedSection = () => {
    if (restaurants.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended for You
          </Text>
        </View>

        <FlatList
          data={restaurants}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalListContent}
        />
      </View>
    );
  };

  // Loading state
  if (isLoading && restaurants.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingStates.SkeletonList count={5} />
      </View>
    );
  }

  // Error state
  if (error && restaurants.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingStates.EmptyState
          title="Oops! Something went wrong"
          description="We couldn't load the restaurants. Please try again."
          action={{
            label: 'Retry',
            onPress: handleRefresh,
          }}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.background]}
      style={styles.container}
    >
      <Animated.FlatList
        data={[{ type: 'location' }, { type: 'search' }, { type: 'trending' }, { type: 'featured' }, { type: 'categories' }, { type: 'recommended' }]}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'location':
              return renderLocationHeader();
            case 'search':
              return renderSearchBar();
            case 'trending':
              return renderTrendingSection();
            case 'featured':
              return renderFeaturedSection();
            case 'categories':
              return renderCategoriesSection();
            case 'recommended':
              return renderRecommendedSection();
            default:
              return null;
          }
        }}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.septenary}
            colors={[colors.surfaceLight, colors.septenary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: ({ contentOffset }) => contentOffset.y }],
          scrollY
        )}
        ListHeaderComponent={() => (
          <Animated.View style={[styles.headerPlaceholder, { height: headerHeight }]} />
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPlaceholder: {
    backgroundColor: '#1A0A1A',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.background,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationValue: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-SemiBold',
    marginRight: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  categoriesListContent: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  categoryChip: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  horizontalListContent: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  verticalListContent: {
    paddingBottom: 100,
  },
  restaurantCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    height: 140,
    position: 'relative',
  },
  restaurantImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  restaurantImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    marginLeft: 4,
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  restaurantDetails: {
    marginTop: 8,
  },
  cuisineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cuisineTag: {
    backgroundColor: 'rgba(133, 71, 152, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Regular',
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  priceRange: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  priceRangeText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 140, // Space for sticky header
  },
});

export default HomeScreen;