import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { addToCart } from '@store/slices/cartSlice';
import { formatCurrency, formatDateTime } from '@utils/index';
import { Order } from '@types/index';

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  const { orders } = useSelector((state: RootState) => state.order);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock orders data - in real app, this would come from API/state
  const [mockOrders, setMockOrders] = useState<Order[]>([
    {
      id: 'order_1',
      items: [
        {
          id: '1',
          name: 'Margherita Pizza',
          price: 14.99,
          quantity: 2,
          image: 'https://example.com/pizza.jpg',
          customizations: [],
          restaurantId: '1',
          restaurantName: 'Bella Italia Ristorante',
        },
        {
          id: '2',
          name: 'Caesar Salad',
          price: 9.99,
          quantity: 1,
          image: 'https://example.com/salad.jpg',
          customizations: [],
          restaurantId: '1',
          restaurantName: 'Bella Italia Ristorante',
        },
      ],
      deliveryAddress: {
        id: '1',
        name: 'Home',
        street: '123 Main St',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true,
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
      },
      paymentMethod: {
        id: '1',
        type: 'card',
        name: 'Visa ending in 4242',
        cardNumber: '****4242',
        expiryDate: '12/25',
        isDefault: true,
      },
      subtotal: 39.97,
      deliveryFee: 2.99,
      tax: 3.52,
      discount: 5.00,
      total: 41.48,
      status: 'delivered',
      createdAt: '2024-01-15T19:30:00Z',
      estimatedDelivery: '2024-01-15T20:15:00Z',
      actualDeliveryTime: '2024-01-15T20:12:00Z',
      restaurantId: '1',
      restaurantName: 'Bella Italia Ristorante',
      deliveryInstructions: 'Please call when you arrive',
      contactPhone: '+1 (555) 123-4567',
      driver: {
        id: 'driver1',
        name: 'John Smith',
        phone: '+1 (555) 987-6543',
        photo: 'https://example.com/driver.jpg',
        vehicle: {
          make: 'Toyota',
          model: 'Camry',
          color: 'Silver',
          licensePlate: 'ABC123',
        },
        rating: 4.8,
        deliveryCount: 1247,
      },
    },
    {
      id: 'order_2',
      items: [
        {
          id: '3',
          name: 'Spaghetti Carbonara',
          price: 16.99,
          quantity: 1,
          image: 'https://example.com/carbonara.jpg',
          customizations: [],
          restaurantId: '2',
          restaurantName: 'Pasta Paradise',
        },
      ],
      deliveryAddress: {
        id: '1',
        name: 'Work',
        street: '456 Business Ave',
        apartment: 'Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        isDefault: false,
        coordinates: { latitude: 40.7580, longitude: -73.9855 },
      },
      paymentMethod: {
        id: '2',
        type: 'card',
        name: 'Mastercard ending in 8888',
        cardNumber: '****8888',
        expiryDate: '09/24',
        isDefault: false,
      },
      subtotal: 16.99,
      deliveryFee: 3.99,
      tax: 1.70,
      discount: 0,
      total: 22.68,
      status: 'delivered',
      createdAt: '2024-01-14T12:45:00Z',
      estimatedDelivery: '2024-01-14T13:30:00Z',
      actualDeliveryTime: '2024-01-14T13:25:00Z',
      restaurantId: '2',
      restaurantName: 'Pasta Paradise',
      deliveryInstructions: '',
      contactPhone: '+1 (555) 123-4567',
      driver: {
        id: 'driver2',
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6544',
        photo: 'https://example.com/driver2.jpg',
        vehicle: {
          make: 'Honda',
          model: 'Civic',
          color: 'Blue',
          licensePlate: 'DEF456',
        },
        rating: 4.9,
        deliveryCount: 892,
      },
    },
    {
      id: 'order_3',
      items: [
        {
          id: '4',
          name: 'Chicken Tikka Masala',
          price: 18.99,
          quantity: 1,
          image: 'https://example.com/tikka.jpg',
          customizations: [],
          restaurantId: '3',
          restaurantName: 'Spice Garden',
        },
        {
          id: '5',
          name: 'Naan Bread',
          price: 3.99,
          quantity: 2,
          image: 'https://example.com/naan.jpg',
          customizations: [],
          restaurantId: '3',
          restaurantName: 'Spice Garden',
        },
      ],
      deliveryAddress: {
        id: '1',
        name: 'Home',
        street: '123 Main St',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true,
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
      },
      paymentMethod: {
        id: '3',
        type: 'paypal',
        name: 'PayPal',
        email: 'user@example.com',
        isDefault: false,
      },
      subtotal: 26.97,
      deliveryFee: 2.99,
      tax: 2.42,
      discount: 0,
      total: 32.38,
      status: 'cancelled',
      createdAt: '2024-01-13T18:20:00Z',
      estimatedDelivery: '2024-01-13T19:05:00Z',
      actualDeliveryTime: null,
      restaurantId: '3',
      restaurantName: 'Spice Garden',
      deliveryInstructions: '',
      contactPhone: '+1 (555) 123-4567',
      cancelReason: 'Customer requested cancellation',
    },
    {
      id: 'order_4',
      items: [
        {
          id: '6',
          name: 'Veggie Burger',
          price: 12.99,
          quantity: 1,
          image: 'https://example.com/burger.jpg',
          customizations: [],
          restaurantId: '4',
          restaurantName: 'Burger Barn',
        },
      ],
      deliveryAddress: {
        id: '1',
        name: 'Home',
        street: '123 Main St',
        apartment: '2B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true,
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
      },
      paymentMethod: {
        id: '4',
        type: 'apple-pay',
        name: 'Apple Pay',
        isDefault: false,
      },
      subtotal: 12.99,
      deliveryFee: 1.99,
      tax: 1.16,
      discount: 0,
      total: 16.14,
      status: 'on-the-way',
      createdAt: '2024-01-20T14:15:00Z',
      estimatedDelivery: '2024-01-20T14:45:00Z',
      actualDeliveryTime: null,
      restaurantId: '4',
      restaurantName: 'Burger Barn',
      deliveryInstructions: 'Leave at door',
      contactPhone: '+1 (555) 123-4567',
    },
  ]);

  useEffect(() => {
    // In real app, this would fetch from API
    if (orders.length === 0) {
      // Use mock data when Redux store is empty
      // This simulates the API call
      setTimeout(() => {
        // Dispatch action to set orders in Redux
        // For now, we'll use the local state
      }, 100);
    }
  }, []);

  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = selectedFilter === 'all' ||
                          (selectedFilter === 'ongoing' && ['preparing', 'ready', 'on-the-way'].includes(order.status)) ||
                          (selectedFilter === 'completed' && order.status === 'delivered') ||
                          (selectedFilter === 'cancelled' && order.status === 'cancelled');

    const matchesSearch = !searchQuery ||
                         order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      'Reorder Items',
      `Add all items from this order to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            order.items.forEach(item => {
              dispatch(addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                customizations: item.customizations,
                restaurantId: order.restaurantId,
                restaurantName: order.restaurantName,
              }));
            });

            Alert.alert(
              'Added to Cart',
              'All items from this order have been added to your cart.',
              [
                { text: 'Continue Shopping', style: 'cancel' },
                { text: 'View Cart', onPress: () => navigation.navigate('Cart' as never) },
              ]
            );
          },
        },
      ]
    );
  };

  const handleTrackOrder = (order: Order) => {
    navigation.navigate('OrderTracking' as never, { orderId: order.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10B981';
      case 'on-the-way':
      case 'ready':
      case 'preparing':
        return '#3B82F6';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'on-the-way':
        return 'On the Way';
      case 'ready':
        return 'Ready for Pickup';
      case 'preparing':
        return 'Preparing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.surface }]}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderId, { color: colors.text }]}>
            Order #{item.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={[styles.restaurantName, { color: colors.textSecondary }]}>
            {item.restaurantName}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textTertiary }]}>
            {formatDateTime(item.createdAt)}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.itemName, { color: colors.text }]}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {formatCurrency(orderItem.price * orderItem.quantity)}
            </Text>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={[styles.moreItemsText, { color: colors.textTertiary }]}>
            +{item.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatCurrency(item.total)}
          </Text>
        </View>

        {item.status === 'delivered' && item.actualDeliveryTime && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Delivered
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDateTime(item.actualDeliveryTime)}
            </Text>
          </View>
        )}

        {item.status === 'cancelled' && item.cancelReason && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Reason
            </Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
              {item.cancelReason}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.orderActions}>
        {item.status !== 'cancelled' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.septenary }]}
            onPress={() => handleTrackOrder(item)}
          >
            <Icon name="location-outline" size={16} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Track
            </Text>
          </TouchableOpacity>
        )}

        {item.status === 'delivered' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.septenary }]}
            onPress={() => handleReorder(item)}
          >
            <Icon name="refresh-outline" size={16} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Reorder
            </Text>
          </TouchableOpacity>
        )}

        {item.status === 'delivered' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('Review' as never, { orderId: item.id })}
          >
            <Icon name="star-outline" size={16} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              Review
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Order History
      </Text>

      <TouchableOpacity style={styles.helpButton}>
        <Icon name="help-circle-outline" size={24} color={color.text} />
      </TouchableOpacity>
    </View>
  );

  const renderFilterTabs = () => (
    <View style={[styles.filterTabs, { backgroundColor: colors.surface }]}>
      {[
        { id: 'all', label: 'All', count: mockOrders.length },
        { id: 'ongoing', label: 'Ongoing', count: mockOrders.filter(o => ['preparing', 'ready', 'on-the-way'].includes(o.status)).length },
        { id: 'completed', label: 'Completed', count: mockOrders.filter(o => o.status === 'delivered').length },
        { id: 'cancelled', label: 'Cancelled', count: mockOrders.filter(o => o.status === 'cancelled').length },
      ].map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterTab,
            {
              backgroundColor: selectedFilter === filter.id ? colors.septenary : 'transparent',
            },
          ]}
          onPress={() => setSelectedFilter(filter.id as typeof selectedFilter)}
        >
          <Text
            style={[
              styles.filterTabText,
              {
                color: selectedFilter === filter.id ? colors.text : colors.textSecondary,
              },
            ]}
          >
            {filter.label}
          </Text>
          {filter.count > 0 && (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{filter.count}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
      <Icon name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search orders or restaurants..."
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="receipt-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No orders yet
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        Once you place an order, it will appear here
      </Text>

      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.septenary }]}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Icon name="restaurant" size={20} color={colors.text} />
        <Text style={[styles.browseButtonText, { color: colors.text }]}>
          Browse Restaurants
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderHeader()}
      {renderFilterTabs()}
      {renderSearchBar()}

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.septenary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Semibold',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    position: 'relative',
    minHeight: 36,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  filterCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Semibold',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  moreItemsText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Semibold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Semibold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default OrderHistoryScreen;