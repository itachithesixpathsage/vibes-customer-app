import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { addToCart } from '@store/slices/cartSlice';
import { formatCurrency } from '@utils/index';
import { Restaurant, MenuItem, Review } from '@types/index';

const { width, height } = Dimensions.get('window');

const RestaurantScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  // Get restaurant from route params or use mock data
  const restaurant = route.params?.restaurant as Restaurant || {
    id: '1',
    name: 'Bella Italia Ristorante',
    description: 'Authentic Italian cuisine with a modern twist. Experience the taste of Italy with our handmade pasta and wood-fired pizzas.',
    image: 'https://example.com/restaurant.jpg',
    rating: 4.5,
    reviewCount: 342,
    deliveryTime: { min: 30, max: 45 },
    deliveryFee: 2.99,
    priceRange: 3,
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    address: '123 Main St, New York, NY',
    phone: '+1 (555) 123-4567',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' },
    },
    features: ['delivery', 'pickup', 'reservations', 'credit-cards'],
    featured: true,
    isOpen: true,
  };

  const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'reviews'>('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Load menu items and reviews (mock data for now)
    loadMenuItems();
    loadReviews();
  }, []);

  const loadMenuItems = () => {
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil on wood-fired dough',
        price: 14.99,
        category: 'pizza',
        image: 'https://example.com/pizza.jpg',
        ingredients: ['mozzarella', 'tomato sauce', 'fresh basil', 'olive oil'],
        allergens: ['dairy', 'gluten'],
        nutritionInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10,
        },
        isVegetarian: true,
        isPopular: true,
        preparationTime: 15,
        available: true,
      },
      {
        id: '2',
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, pecorino cheese, and guanciale',
        price: 16.99,
        category: 'pasta',
        image: 'https://example.com/carbonara.jpg',
        ingredients: ['spaghetti', 'eggs', 'pecorino cheese', 'guanciale', 'black pepper'],
        allergens: ['dairy', 'gluten', 'eggs'],
        nutritionInfo: {
          calories: 520,
          protein: 22,
          carbs: 58,
          fat: 24,
        },
        isPopular: true,
        preparationTime: 20,
        available: true,
      },
      {
        id: '3',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, Caesar dressing',
        price: 9.99,
        category: 'salads',
        image: 'https://example.com/caesar.jpg',
        ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
        allergens: ['dairy', 'gluten', 'eggs'],
        nutritionInfo: {
          calories: 320,
          protein: 8,
          carbs: 12,
          fat: 28,
        },
        isVegetarian: true,
        preparationTime: 10,
        available: true,
      },
      {
        id: '4',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        category: 'desserts',
        image: 'https://example.com/tiramisu.jpg',
        ingredients: ['ladyfingers', 'mascarpone', 'coffee', 'cocoa powder'],
        allergens: ['dairy', 'eggs', 'gluten'],
        nutritionInfo: {
          calories: 450,
          protein: 6,
          carbs: 42,
          fat: 28,
        },
        isVegetarian: true,
        preparationTime: 5,
        available: true,
      },
    ];
    setMenuItems(mockMenuItems);
  };

  const loadReviews = () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://example.com/avatar1.jpg',
        rating: 5,
        comment: 'Amazing food and great service! The pasta was perfectly cooked and the atmosphere was lovely.',
        date: '2024-01-15',
        helpful: 24,
        images: ['https://example.com/review1.jpg'],
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: 'https://example.com/avatar2.jpg',
        rating: 4,
        comment: 'Really enjoyed the pizza, authentic Italian taste. Delivery was quick and food was still hot.',
        date: '2024-01-14',
        helpful: 12,
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Emily Davis',
        userAvatar: 'https://example.com/avatar3.jpg',
        rating: 5,
        comment: 'Best Italian restaurant in the area! The carbonara is to die for.',
        date: '2024-01-13',
        helpful: 18,
      },
    ];
    setReviews(mockReviews);
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: 'grid-outline' },
    { id: 'pizza', name: 'Pizza', icon: 'pizza-outline' },
    { id: 'pasta', name: 'Pasta', icon: 'restaurant-outline' },
    { id: 'salads', name: 'Salads', icon: 'leaf-outline' },
    { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' },
  ];

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (menuItem: MenuItem) => {
    dispatch(addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: 1,
      customizations: [],
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    }));

    Alert.alert(
      'Added to Cart',
      `${menuItem.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart' as never) },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton}>
        <Icon name="share-outline" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderRestaurantInfo = () => (
    <View style={styles.restaurantInfo}>
      <View style={styles.restaurantImageContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
          style={styles.imageOverlay}
        />
        <View style={styles.restaurantImagePlaceholder}>
          <Icon name="restaurant" size={60} color={colors.textTertiary} />
        </View>
        {restaurant.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.restaurantDetails}>
        <View style={styles.nameRow}>
          <Text style={[styles.restaurantName, { color: colors.text }]}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color={colors.warning} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {restaurant.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              ({restaurant.reviewCount})
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {restaurant.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="bicycle-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {formatCurrency(restaurant.deliveryFee)} delivery
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.priceRange, { color: colors.textSecondary }]}>
              {'$'.repeat(restaurant.priceRange)}
            </Text>
          </View>
        </View>

        {restaurant.isOpen ? (
          <View style={styles.statusOpen}>
            <Icon name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.statusOpenText}>Open now</Text>
          </View>
        ) : (
          <View style={styles.statusClosed}>
            <Icon name="close-circle" size={14} color="#EF4444" />
            <Text style={styles.statusClosedText}>Closed</Text>
          </View>
        )}

        <View style={styles.cuisineTags}>
          {restaurant.cuisine.map((cuisine, index) => (
            <View key={index} style={styles.cuisineTag}>
              <Text style={[styles.cuisineText, { color: colors.septenary }]}>
                {cuisine}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
      {(['menu', 'info', 'reviews'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && [styles.activeTab, { borderBottomColor: colors.septenary }],
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab ? colors.text : colors.textSecondary },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category.id
                ? colors.septenary
                : 'rgba(255,255,255,0.1)',
            },
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Icon
            name={category.icon}
            size={18}
            color={selectedCategory === category.id ? colors.text : colors.textSecondary}
          />
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === category.id ? colors.text : colors.textSecondary },
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.surface }]}
      activeOpacity={0.9}
    >
      <View style={styles.menuItemImageContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
          style={styles.menuItemImageOverlay}
        />
        <View style={styles.menuItemImagePlaceholder}>
          <Icon name="restaurant" size={30} color={colors.textTertiary} />
        </View>
      </View>

      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <Text style={[styles.menuItemName, { color: colors.text }]}>
            {item.name}
          </Text>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Icon name="flame" size={12} color={colors.warning} />
              <Text style={[styles.popularText, { color: colors.warning }]}>Popular</Text>
            </View>
          )}
        </View>

        <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.menuItemMeta}>
          <Text style={[styles.menuItemPrice, { color: colors.septenary }]}>
            {formatCurrency(item.price)}
          </Text>
          <View style={styles.menuItemTags}>
            {item.isVegetarian && (
              <View style={[styles.dietaryTag, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                <Text style={[styles.dietaryText, { color: '#22C55E' }]}>Veg</Text>
              </View>
            )}
            <Text style={[styles.prepTime, { color: colors.textSecondary }]}>
              <Icon name="time-outline" size={12} color={colors.textSecondary} />
              {' '}{item.preparationTime}min
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.septenary }]}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderMenuTab = () => (
    <View style={styles.menuContainer}>
      {renderCategories()}
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuListContent}
      />
    </View>
  );

  const renderInfoTab = () => (
    <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Address</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {restaurant.address}
        </Text>
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Phone</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {restaurant.phone}
        </Text>
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Hours</Text>
        {Object.entries(restaurant.hours).map(([day, hours]) => (
          <View key={day} style={styles.hoursRow}>
            <Text style={[styles.dayText, { color: colors.textSecondary }]}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
            <Text style={[styles.hoursText, { color: colors.text }]}>
              {hours.open} - {hours.close}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderReviewsTab = () => (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.reviewsListContent}
    />
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={[styles.reviewItem, { backgroundColor: colors.surface }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Icon name="person" size={24} color={colors.textTertiary} />
        </View>
        <View style={styles.reviewMeta}>
          <Text style={[styles.reviewName, { color: colors.text }]}>
            {item.userName}
          </Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={12}
                color={index < item.rating ? colors.warning : 'rgba(255,255,255,0.2)'}
              />
            ))}
          </View>
          <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>
      </View>

      <Text style={[styles.reviewComment, { color: colors.text }]}>
        {item.comment}
      </Text>

      {item.helpful > 0 && (
        <View style={styles.reviewFooter}>
          <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
            {item.helpful} found this helpful
          </Text>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return renderMenuTab();
      case 'info':
        return renderInfoTab();
      case 'reviews':
        return renderReviewsTab();
      default:
        return renderMenuTab();
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {renderRestaurantInfo()}
        {renderTabs()}
        {renderContent()}
      </ScrollView>

      {cartItems.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingCartButton, { backgroundColor: colors.septenary }]}
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <Icon name="cart" size={20} color={colors.text} />
          <View style={[styles.cartBadge, { backgroundColor: colors.warning }]}>
            <Text style={styles.cartBadgeText}>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: 100,
  },
  restaurantInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  restaurantImageContainer: {
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  imageOverlay: {
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
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#854798',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  restaurantDetails: {
    paddingHorizontal: 4,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'SFProDisplay-Bold',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
    marginLeft: 4,
    color: '#FFFFFF',
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginLeft: 2,
    color: 'rgba(255,255,255,0.6)',
  },
  description: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  priceRange: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-SemiBold',
  },
  statusOpen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusOpenText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  statusClosed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusClosedText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    color: '#EF4444',
    marginLeft: 4,
  },
  cuisineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineTag: {
    backgroundColor: 'rgba(133, 71, 152, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cuisineText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  menuContainer: {
    flex: 1,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  menuListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  menuItemImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  menuItemImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  menuItemInfo: {
    flex: 1,
    position: 'relative',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    flex: 1,
    marginRight: 8,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Medium',
  },
  menuItemDescription: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 16,
    marginBottom: 8,
  },
  menuItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Bold',
  },
  menuItemTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dietaryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dietaryText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Semibold',
  },
  prepTime: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    flex: 1,
  },
  hoursText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  reviewsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  reviewItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Bold',
    color: '#FFFFFF',
  },
});

export default RestaurantScreen;