import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
  Linking,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { formatCurrency, formatDateTime } from '@utils/index';
import { Order, OrderStatus } from '@types/index';

const { width, height } = Dimensions.get('window');

type OrderStep = {
  id: string;
  title: string;
  description: string;
  time?: string;
  completed: boolean;
  active: boolean;
};

const OrderTrackingScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  const orderId = route.params?.orderId as string || 'order_default';

  // Mock order data - in real app, this would come from API/state
  const [order, setOrder] = useState<Order>({
    id: orderId,
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
    subtotal: 29.98,
    deliveryFee: 2.99,
    tax: 2.65,
    discount: 0,
    total: 35.62,
    status: 'on-the-way',
    createdAt: '2024-01-20T12:30:00Z',
    estimatedDelivery: '2024-01-20T13:15:00Z',
    actualDeliveryTime: null,
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
    tracking: {
      driverLocation: { latitude: 40.7200, longitude: -74.0100 },
      estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
  });

  const [orderSteps, setOrderSteps] = useState<OrderStep[]>([]);
  const [driverLocation, setDriverLocation] = useState(order.tracking?.driverLocation || null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // Simulate real-time updates
  useEffect(() => {
    updateOrderSteps();

    const interval = setInterval(() => {
      // Simulate driver movement
      if (order.status === 'on-the-way' && driverLocation) {
        const newLat = driverLocation.latitude + (Math.random() - 0.5) * 0.001;
        const newLng = driverLocation.longitude + (Math.random() - 0.5) * 0.001;
        setDriverLocation({ latitude: newLat, longitude: newLng });

        setMapRegion(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLng,
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order.status, driverLocation]);

  const updateOrderSteps = () => {
    const steps: OrderStep[] = [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been received and is being prepared',
        completed: true,
        active: false,
        time: '12:30 PM',
      },
      {
        id: 'preparing',
        title: 'Preparing Your Order',
        description: 'The restaurant is preparing your food',
        completed: ['delivered', 'on-the-way'].includes(order.status),
        active: order.status === 'preparing',
        time: '12:35 PM',
      },
      {
        id: 'ready',
        title: 'Ready for Pickup',
        description: 'Your order is ready and waiting for the driver',
        completed: ['delivered'].includes(order.status),
        active: false,
        time: '12:50 PM',
      },
      {
        id: 'on-the-way',
        title: 'On the Way',
        description: 'Your order is being delivered',
        completed: order.status === 'delivered',
        active: order.status === 'on-the-way',
        time: '1:00 PM',
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        completed: order.status === 'delivered',
        active: false,
        time: order.status === 'delivered' ? '1:15 PM' : undefined,
      },
    ];

    setOrderSteps(steps);
  };

  const handleCallDriver = () => {
    if (order.driver?.phone) {
      Alert.alert(
        'Call Driver',
        `Would you like to call ${order.driver.name} at ${order.driver.phone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => Linking.openURL(`tel:${order.driver.phone}`),
          },
        ]
      );
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? You may be charged a cancellation fee.',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => {
            // In real app, call API to cancel order
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            navigation.navigate('OrderHistory' as never);
          },
        },
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

      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Track Order
      </Text>

      <TouchableOpacity style={styles.helpButton}>
        <Icon name="help-circle-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderOrderInfo = () => (
    <View style={[styles.orderInfo, { backgroundColor: colors.surface }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderTitle, { color: colors.text }]}>
          Order #{order.id.slice(-6).toUpperCase()}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: order.status === 'delivered' ? '#10B981' :
                             order.status === 'on-the-way' ? '#3B82F6' : '#F59E0B' }
        ]}>
          <Text style={styles.statusText}>
            {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
      </View>

      <Text style={[styles.restaurantName, { color: colors.textSecondary }]}>
        {order.restaurantName}
      </Text>

      <Text style={[styles.orderTime, { color: colors.textSecondary }]}>
        Ordered at {formatDateTime(order.createdAt)}
      </Text>

      <View style={styles.ETAContainer}>
        <Icon name="time-outline" size={20} color={colors.septenary} />
        <View style={styles.ETAInfo}>
          <Text style={[styles.ETALabel, { color: colors.textSecondary }]}>
            Estimated Delivery
          </Text>
          <Text style={[styles.ETATime, { color: colors.text }]}>
            {formatDateTime(order.estimatedDelivery)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMap = () => (
    <View style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.mapPlaceholder}>
        <Icon name="map-outline" size={60} color={colors.textTertiary} />
        <Text style={[styles.mapPlaceholderText, { color: colors.textSecondary }]}>
          Map View
        </Text>
        <Text style={[styles.mapSubText, { color: colors.textTertiary }]}>
          {driverLocation ? `Driver: ${driverLocation.latitude.toFixed(4)}, ${driverLocation.longitude.toFixed(4)}` : 'Loading location...'}
        </Text>
      </View>

      {driverLocation && (
        <View style={styles.mapOverlay}>
          <View style={styles.driverPin}>
            <Icon name="bicycle" size={24} color={colors.septenary} />
          </View>
          <View style={styles.deliveryPin}>
            <Icon name="location" size={24} color="#10B981" />
          </View>
        </View>
      )}
    </View>
  );

  const renderDriverInfo = () => {
    if (!order.driver || order.status !== 'on-the-way') return null;

    return (
      <View style={[styles.driverInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.driverHeader}>
          <Text style={[styles.driverTitle, { color: colors.text }]}>
            Your Driver
          </Text>
          <View style={styles.driverRating}>
            <Icon name="star" size={14} color={colors.warning} />
            <Text style={[styles.driverRatingText, { color: colors.text }]}>
              {order.driver.rating}
            </Text>
          </View>
        </View>

        <View style={styles.driverDetails}>
          <View style={styles.driverAvatar}>
            <Icon name="person" size={30} color={colors.textTertiary} />
          </View>

          <View style={styles.driverMeta}>
            <Text style={[styles.driverName, { color: colors.text }]}>
              {order.driver.name}
            </Text>
            <Text style={[styles.driverVehicle, { color: colors.textSecondary }]}>
              {order.driver.vehicle.color} {order.driver.vehicle.make} {order.driver.vehicle.model}
            </Text>
            <Text style={[styles.driverPlate, { color: colors.textSecondary }]}>
              {order.driver.vehicle.licensePlate}
            </Text>
            <Text style={[styles.driverDeliveries, { color: colors.textSecondary }]}>
              {order.driver.deliveryCount} deliveries
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: colors.septenary }]}
          onPress={handleCallDriver}
        >
          <Icon name="call-outline" size={20} color={colors.text} />
          <Text style={[styles.contactButtonText, { color: colors.text }]}>
            Call Driver
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTimeline = () => (
    <View style={[styles.timelineContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.timelineTitle, { color: colors.text }]}>
        Order Status
      </Text>

      {orderSteps.map((step, index) => (
        <View key={step.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.timelineDot,
                {
                  backgroundColor: step.completed ? colors.septenary : 'rgba(255,255,255,0.3)',
                  borderColor: step.active ? colors.septenary : colors.border,
                  borderWidth: step.active ? 2 : 0,
                },
              ]}
            >
              {step.completed && (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            {index < orderSteps.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor: step.completed ? colors.septenary : colors.border,
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.timelineContent}>
            <Text style={[
              styles.timelineStepTitle,
              { color: step.active ? colors.text : colors.textSecondary }
            ]}>
              {step.title}
            </Text>
            <Text style={[styles.timelineStepDescription, { color: colors.textTertiary }]}>
              {step.description}
            </Text>
            {step.time && (
              <Text style={[styles.timelineStepTime, { color: colors.textSecondary }]}>
                {step.time}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrderDetails = () => (
    <View style={[styles.orderDetails, { backgroundColor: colors.surface }]}>
      <Text style={[styles.detailsTitle, { color: colors.text }]}>
        Order Details
      </Text>

      <View style={styles.detailsSection}>
        <Text style={[styles.detailsSectionTitle, { color: colors.textSecondary }]}>
          Items ({order.items.length})
        </Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.detailItem}>
            <Text style={[styles.detailItemName, { color: colors.text }]}>
              {item.quantity}x {item.name}
            </Text>
            <Text style={[styles.detailItemPrice, { color: colors.text }]}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.detailsSection}>
        <Text style={[styles.detailsSectionTitle, { color: colors.textSecondary }]}>
          Delivery Address
        </Text>
        <Text style={[styles.detailsAddress, { color: colors.text }]}>
          {order.deliveryAddress.name}
          {'\n'}
          {order.deliveryAddress.street}
          {order.deliveryAddress.apartment && `\n${order.deliveryAddress.apartment}`}
          {'\n'}
          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailsRow}>
          <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>
            Subtotal
          </Text>
          <Text style={[styles.detailsValue, { color: colors.text }]}>
            {formatCurrency(order.subtotal)}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>
            Delivery Fee
          </Text>
          <Text style={[styles.detailsValue, { color: colors.text }]}>
            {formatCurrency(order.deliveryFee)}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[styles.detailsLabel, { color: colors.textSecondary }]}>
            Tax
          </Text>
          <Text style={[styles.detailsValue, { color: colors.text }]}>
            {formatCurrency(order.tax)}
          </Text>
        </View>

        <View style={[styles.detailsDivider, { backgroundColor: colors.border }]} />

        <View style={styles.detailsRow}>
          <Text style={[styles.detailsTotalLabel, { color: colors.text }]}>
            Total
          </Text>
          <Text style={[styles.detailsTotalValue, { color: colors.septenary }]}>
            {formatCurrency(order.total)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => {
    if (order.status === 'delivered') {
      return (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.septenary }]}
            onPress={() => navigation.navigate('Restaurant' as never, { restaurantId: order.restaurantId })}
          >
            <Icon name="restaurant" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Order Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.septenary }]}
            onPress={() => navigation.navigate('Review' as never, { orderId: order.id })}
          >
            <Icon name="star-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Leave Review
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status !== 'delivered') {
      return (
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={handleCancelOrder}
        >
          <Text style={[styles.cancelButtonText, { color: '#EF4444' }]}>
            Cancel Order
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderOrderInfo()}
        {renderMap()}
        {renderDriverInfo()}
        {renderTimeline()}
        {renderOrderDetails()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderActionButtons()}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  orderInfo: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Semibold',
    color: '#FFFFFF',
  },
  restaurantName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  ETAContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(133, 71, 152, 0.1)',
    borderRadius: 12,
  },
  ETAInfo: {
    flex: 1,
  },
  ETALabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  ETATime: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  mapContainer: {
    margin: 20,
    height: 200,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginTop: 8,
    marginBottom: 4,
  },
  mapSubText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  driverPin: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deliveryPin: {
    position: 'absolute',
    bottom: '30%',
    right: '25%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  driverInfo: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverRatingText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverMeta: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 2,
  },
  driverVehicle: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 2,
  },
  driverPlate: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  driverDeliveries: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  timelineContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineStepTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 4,
  },
  timelineStepDescription: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  timelineStepTime: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  orderDetails: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsSectionTitle: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    marginBottom: 8,
    color: 'rgba(255,255,255,0.6)',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    marginBottom: 2,
  },
  detailItemName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    flex: 1,
  },
  detailItemPrice: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  detailsAddress: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailsLabel: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  detailsValue: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  detailsDivider: {
    height: 1,
    marginVertical: 8,
  },
  detailsTotalLabel: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  detailsTotalValue: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
  },
  bottomPadding: {
    height: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default OrderTrackingScreen;