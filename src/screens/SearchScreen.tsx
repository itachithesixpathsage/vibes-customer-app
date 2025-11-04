import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SectionList,
  Dimensions,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { LoadingStates } from '@components/common';
import { theme } from '@theme/index';
import { searchRestaurants } from '@store/slices/restaurantSlice';
import { RootState } from '@store/index';
import { formatCurrency } from '@utils/index';
import { RestaurantSearchFilters } from '@types/restaurant';

const { width, height } = Dimensions.get('window');

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const {
    searchResults,
    categories,
    isLoading,
  } = useSelector((state: RootState) => state.restaurant);

  // Get filters from route params or default
  const routeParams = route.params as { filters?: RestaurantSearchFilters } || {};
  const initialFilters = {
    query: routeParams.filters?.query || '',
    cuisine: routeParams.filters?.cuisine || [],
    priceRange: routeParams.filters?.priceRange || [],
    rating: routeParams.filters?.rating || 0,
    deliveryTime: routeParams.filters?.deliveryTime,
    distance: routeParams.filters?.distance,
    features: routeParams.filters?.features || [],
    dietary: routeParams.filters?.dietary || [],
    sortBy: routeParams.filters?.sortBy || 'relevance',
    isOpen: routeParams.filters?.isOpen,
    featured: routeParams.filters?.featured,
    trending: routeParams.filters?.trending,
  };

  const [searchQuery, setSearchQuery] = useState(initialFilters.query);
  const [filters, setFilters] = useState<RestaurantSearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<TextInput>(null);
  const filtersListRef = useRef<SectionList>(null);

  useEffect(() => {
    // Load recent searches from storage
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (routeParams?.filters) {
      setFilters(routeParams.filters);
      if (routeParams.filters.query) {
        setSearchQuery(routeParams.filters.query);
        performSearch(routeParams.filters);
      }
    }
  }, [routeParams]);

  const loadRecentSearches = () => {
    // Load from storage (mock data for now)
    setRecentSearches([
      'Pizza places near me',
      'Italian food',
      'Vegetarian options',
      'Fast delivery',
      'Chinese takeout',
      'Healthy choices',
    ]);
  };

  const performSearch = async (searchFilters: RestaurantSearchFilters) => {
    try {
      const result = await dispatch(searchRestaurants(searchFilters));
      if (searchRestaurants.rejected.match(result)) {
        Alert.alert('Search Error', result.payload as string);
      }
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    }
  };

  const handleSearch = () => {
    const searchParams = {
      ...filters,
      query: searchQuery.trim(),
    };

    // Add to recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }

    performSearch(searchParams);
  };

  const handleFilterPress = (filterType: string) => {
    const updatedFilters = { ...filters };

    switch (filterType) {
      case 'priceRange':
        updatedFilters.priceRange = togglePriceRange(updatedFilters.priceRange);
        break;
      case 'rating':
        updatedFilters.rating = updatedFilters.rating === 0 ? 0 : updatedFilters.rating - 1;
        break;
      case 'deliveryTime':
        updatedFilters.deliveryTime = toggleDeliveryTime(updatedFilters.deliveryTime);
        break;
      case 'distance':
        updatedFilters.distance = toggleDistance(updatedFilters.distance);
        break;
      case 'cuisine':
        updatedFilters.cuisine = updateCuisineFilter(updatedFilters.cuisine, filterType === 'add' ? '' : '');
        break;
      case 'dietary':
        updatedFilters.dietary = updateDietaryFilter(updatedFilters.dietary, filterType === 'add' ? '' : '');
        break;
    }

    setFilters(updatedFilters);
  };

  const togglePriceRange = (currentRange: number[]) => {
    const ranges = [1, 2, 3, 4];
    const index = ranges.indexOf(currentRange[0] || 1);
    if (index === -1) return [1, 2, 3, 4];
    const nextIndex = (index + 1) % ranges.length;
    return [
      ranges[nextIndex],
      ...currentRange.slice(1),
    ];
  };

  const toggleDeliveryTime = (currentTime: number) => {
    const times = [20, 30, 45];
    const index = times.indexOf(currentTime);
    if (index === -1) return [20];
    const nextIndex = (index + 1) % times.length;
    return [times[nextIndex]];
  };

  const toggleDistance = (currentDistance: number) => {
    const distances = [2, 5, 10];
    const index = distances.indexOf(currentDistance);
    if (index === -1) return [5];
    const nextIndex = (index + 1) % distances.length;
    return [distances[nextIndex]];
  };

  const updateCuisineFilter = (currentCuisines: string[], filterType: 'add' | 'remove') => {
    if (filterType === 'remove') {
      // Remove last item
      return currentCuisines.slice(0, -1);
    }

    const allCuisines = [
      'italian',
      'japanese',
      'mexican',
      'american',
      'chinese',
      'indian',
      'thai',
      'mediterranean',
      'korean',
      'french',
      'spanish',
      'middle-eastern',
      'caribbean',
    ];

    // For 'add' with no specific cuisine, add first 4
    if (currentCuisines.length === 0) {
      return allCuisines.slice(0, 4);
    }

    return currentCuisines.includes(filterType)
      ? currentCuisines.filter(c => c !== filterType)
      : [...currentCuisines, filterType];
  };

  const updateDietaryFilter = (currentDietary: string[], filterType: 'add' | 'remove') => {
    const dietaryOptions = [
      'vegetarian',
      'vegan',
      'gluten-free',
      'halal',
      'kosher',
    ];

    if (filterType === 'remove') {
      // Remove last item
      return currentDietary.slice(0, -1);
    }

    return currentDietary.includes(filterType)
      ? currentDietary.filter(d => d !== filterType)
      : [...currentDietary, filterType];
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.cuisine.length > 0) count++;
    if (filters.priceRange.length > 2) count++;
    if (filters.rating > 0) count++;
    if (filters.deliveryTime) count++;
    if (filters.distance) count++;
    if (filters.features.length > 0) count++;
    if (filters.dietary.length > 0) count++;
    if (filters.isOpen !== undefined) count++;
    if (filters.featured !== undefined) count++;
    if (filters.trending !== undefined) count++;

    return count;
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  const applyFilters = () => {
    setShowFilters(false);
    performSearch(filters);
  };

  const renderSearchHeader = () => (
    <View style={styles.searchHeader}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.searchInputContainer}>
        <Icon
          name="search-outline"
          size={20}
          color={colors.textTertiary}
          style={styles.searchHeaderIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search restaurants, cuisines, dishes..."
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <TouchableOpacity
        style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.activeFilterButton]}
        onPress={() => setShowFilters(true)}
      >
        <Icon
          name="options-outline"
          size={20}
          color={getActiveFiltersCount() > 0 ? colors.septenary : colors.textTertiary}
        />
        <Text style={[
          styles.filterButtonText,
          { color: getActiveFiltersCount() > 0 ? colors.septenary : colors.textTertiary },
        ]}>
          Filters {getActiveFiltersCount()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <TouchableOpacity
            style={styles.filterCloseButton}
            onPress={() => setShowFilters(false)}
          >
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.filterTitle, { color: colors.text }]}>
            Filters
          </Text>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Search Input */}
          <View style={styles.filterSection}>
            <Input
              label="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon="search-outline"
              placeholder="What are you looking for?"
            />
          </View>

          {/* Cuisine Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Cuisine Type
            </Text>
            <View style={styles.cuisineOptions}>
              {['italian', 'japanese', 'mexican', 'american', 'chinese', 'indian'].map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.cuisineOption,
                    {
                      backgroundColor: filters.cuisine.includes(cuisine)
                        ? colors.septenary
                        : 'rgba(255,255,255,0.1)',
                    },
                    filters.cuisine.includes(cuisine) && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress(cuisine)}
                >
                  <Text
                    style={[
                      styles.cuisineOptionText,
                      {
                        color: filters.cuisine.includes(cuisine)
                          ? colors.text
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Price Range
            </Text>
            <View style={styles.priceOptions}>
              {['$', '$$', '$$$', '$$$$'].map((price, index) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.priceOption,
                    {
                      backgroundColor:
                        filters.priceRange[0] <= index + 1
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.priceRange[0] <= index + 1 && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('priceRange')}
                >
                  <Text
                    style={[
                      styles.priceOptionText,
                      {
                        color:
                          filters.priceRange[0] <= index + 1
                            ? colors.text
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Minimum Rating
            </Text>
            <View style={styles.ratingOptions}>
              {[3, 4, 5].map((rating, index) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingOption,
                    {
                      backgroundColor:
                        filters.rating >= rating
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.rating >= rating && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('rating')}
                >
                  <Icon
                    name="star"
                    size={16}
                    color={
                      filters.rating >= rating ? colors.text : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                    styles.ratingOptionText,
                    {
                      color:
                      filters.rating >= rating ? colors.text : colors.textSecondary,
                    },
                  ]}
                  >
                    {rating}+ ' Stars'
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Delivery Time Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Delivery Time
            </Text>
            <View style={styles.deliveryTimeOptions}>
              {['<20min', '<30min', '<45min', '<60min'].map((time, index) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.deliveryTimeOption,
                    {
                      backgroundColor:
                        filters.deliveryTime
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.deliveryTime && index < 3 && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('deliveryTime')}
                >
                  <Text
                    style={[
                      styles.deliveryTimeText,
                      {
                        color:
                          filters.deliveryTime
                            ? colors.text
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Distance
            </Text>
            <View style={styles.distanceOptions}>
              {['<2km', '<5km', '<10km'].map((distance, index) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceOption,
                    {
                      backgroundColor:
                        filters.distance
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.distance && index < 2 && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('distance')}
                >
                  <Text
                    style={[
                    styles.distanceOptionText,
                    {
                      color:
                      filters.distance
                        ? colors.text
                        : colors.textSecondary,
                    },
                    ]}
                  >
                    {distance}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Features Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Features
            </Text>
            <View style={styles.featureOptions}>
              {['delivery', 'pickup', 'reservations', 'credit-cards', 'apple-pay', 'halal', 'vegetarian-friendly'].map((feature, index) => (
                <TouchableOpacity
                  key={feature}
                  style={[
                    styles.featureOption,
                    {
                      backgroundColor:
                        filters.features.includes(feature)
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.features.includes(feature) && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('features')}
                >
                  <Text
                    style={[
                      styles.featureOptionText,
                      {
                        color:
                          filters.features.includes(feature)
                            ? colors.text
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {feature.replace('-', ' ').charAt(0).toUpperCase() + feature.slice(1))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dietary Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
              Dietary Options
            </Text>
            <View style={styles.dietaryOptions}>
              {['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher'].map((diet, index) => (
                <TouchableOpacity
                  key={diet}
                  style={[
                    styles.dietaryOption,
                    {
                      backgroundColor:
                        filters.dietary.includes(diet)
                          ? colors.septenary
                          : 'rgba(255,255,255,0.1)',
                    },
                    filters.dietary.includes(diet) && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterPress('dietary')}
                >
                  <Text
                    style={[
                      styles.dietaryOptionText,
                      {
                        color:
                          filters.dietary.includes(diet)
                            ? colors.text
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {diet.replace('-', ' ').charAt(0).toUpperCase() + diet.slice(1))}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters Button */}
          <View style={styles.clearFiltersContainer}>
            <Button
              title="Clear All Filters"
              onPress={clearFilters}
              variant="ghost"
              size="medium"
              style={styles.clearFiltersButton}
              fullWidth
            />
          </View>

          {/* Apply Filters Button */}
          <View style={styles.applyFiltersButtonContainer}>
            <Button
              title={`Apply Filters (${getActiveFiltersCount()})`}
              onPress={applyFilters}
              variant="primary"
              size="large"
              fullWidth
              icon="checkmark-circle-outline"
              disabled={getActiveFiltersCount() === 0}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderRecentSearches = () => {
    if (recentSearches.length === 0) return null;

    return (
      <View style={styles.recentSearchesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Searches
        </Text>
        <View style={styles.recentSearchList}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => {
                setSearchQuery(search);
                handleSearch();
              }}
            >
              <Icon
                name="time-outline"
                size={16}
                color={colors.textTertiary}
                style={styles.recentSearchIcon}
              />
              <Text
                style={[styles.recentSearchText, { color: colors.text }]}
              >
                {search}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (searchResults.length === 0 && !isLoading) {
      return (
        <View style={styles.noResultsContainer}>
          <LoadingStates.EmptyState
            title="No Results Found"
            description="Try adjusting your search terms or filters"
            action={{
              label: 'Clear Filters',
              onPress: clearFilters,
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={searchResults}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsListContent}
          ListHeaderComponent={() => (
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {searchResults.length} restaurants found
            </Text>
          )}
        />
      </View>
    );
  };

  const renderRestaurantCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.searchResultCard}
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
                  <Text
                    style={[styles.cuisineText, { color: colors.textSecondary }]}>
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
  };

  const { colors } = theme;

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderSearchHeader()}

      {showFilters && renderFilterModal()}

      {searchQuery && (
        <View style={styles.activeSearchContainer}>
          <TouchableOpacity
            style={styles.activeSearchInput}
            onPress={() => {
              setShowFilters(false);
              searchInputRef.current?.focus();
            }}
          >
            <Icon
              name="search"
              size={20}
              color={colors.septenary}
              style={styles.activeSearchIcon}
            />
          </TouchableOpacity>
          <Text style={[styles.activeSearchText, { color: colors.text }]}>
            {searchQuery}
          </Text>
        </View>
      )}

      {recentSearches.length > 0 && !searchQuery && renderRecentSearches()}

      {(searchQuery || searchResults.length > 0 || isLoading) && renderSearchResults()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
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
    backgroundColor: '#1A0A1A',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    flex: 1,
  },
  searchHeaderIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  activeSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(133, 71, 152, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  activeSearchIcon: {
    marginRight: 12,
  },
  activeSearchText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  filterButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    marginLeft: 8,
  },
  activeFilterButton: {
    backgroundColor: 'rgba(133, 71, 152, 0.3)',
    borderWidth: 1,
    borderColor: '#854798',
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-SemiBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  filterContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  cuisineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  cuisineOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  cuisineOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  priceOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  priceOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 60,
  },
  priceOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  ratingOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
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
    fontFamily: ' Filters.fontFamily: 'SFProDisplay-SemiBold',
  },
  distanceOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  distanceOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  distanceOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  featureOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  featureOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  featureOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  dietaryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  dietaryOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  dietaryOptionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  clearFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  applyFiltersButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  recentSearchesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-SemiBold',
    marginBottom: 12,
  },
  recentSearchList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 8,
  },
  recentSearchIcon: {
    marginRight: 8,
  },
  recentSearchText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    color: '#FFFFFF',
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    marginTop: 8,
    marginBottom: 16,
  },
  resultsListContent: {
    paddingBottom: 20,
  },
  searchResultCard: {
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
  },
});

export default SearchScreen;