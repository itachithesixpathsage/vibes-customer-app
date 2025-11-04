import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
} from '@store/slices/cartSlice';
import { formatCurrency } from '@utils/index';
import { CartItem } from '@types/index';

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  const {
    items: cartItems,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    coupon,
  } = useSelector((state: RootState) => state.cart);

  const [couponCode, setCouponCode] = useState(coupon?.code || '');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${itemName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeFromCart(itemId)) },
      ]
    );
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert('Invalid Coupon', 'Please enter a coupon code');
      return;
    }

    // Mock coupon validation
    const validCoupons = {
      SAVE10: { discount: 0.1, description: '10% off your order' },
      SAVE20: { discount: 0.2, description: '20% off your order' },
      FREESHIP: { discount: 0, description: 'Free delivery' },
      WELCOME15: { discount: 0.15, description: '15% off your first order' },
    };

    const couponInfo = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];

    if (couponInfo) {
      dispatch(applyCoupon({
        code: couponCode.toUpperCase(),
        discount: couponInfo.discount,
        description: couponInfo.description,
      }));
      Alert.alert('Success', `Coupon "${couponCode.toUpperCase()}" applied!`);
    } else {
      Alert.alert('Invalid Coupon', 'This coupon code is not valid or has expired');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    // Dispatch action to remove coupon (would be implemented in slice)
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items first!');
      return;
    }

    // Navigate to checkout screen
    navigation.navigate('Checkout' as never);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const isExpanded = expandedItems.has(item.id);
    const itemTotal = (item.price + item.customizations.reduce((sum, group) =>
      sum + group.selections.reduce((selectionSum, selection) => selectionSum + selection.price, 0), 0
    )) * item.quantity;

    return (
      <Animated.View
        style={[
          styles.cartItem,
          {
            backgroundColor: colors.surface,
            opacity: slideAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            }]
          },
        ]}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.restaurantName, { color: colors.textSecondary }]}>
              from {item.restaurantName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id, item.name)}
          >
            <Icon name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.priceRow}>
            <Text style={[styles.itemPrice, { color: colors.septenary }]}>
              {formatCurrency(item.price)}
            </Text>
            <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
              x{item.quantity}
            </Text>
            <Text style={[styles.itemTotal, { color: colors.text }]}>
              {formatCurrency(itemTotal)}
            </Text>
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.border }]}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <Icon name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <View style={[styles.quantityDisplay, { backgroundColor: colors.background }]}>
              <Text style={[styles.quantityText, { color: colors.text }]}>
                {item.quantity}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.border }]}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Icon name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {item.customizations.length > 0 && (
            <TouchableOpacity
              style={styles.customizationsToggle}
              onPress={() => toggleItemExpansion(item.id)}
            >
              <Icon
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.customizationsText, { color: colors.textSecondary }]}>
                {item.customizations.length} customization{item.customizations.length > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}

          {isExpanded && item.customizations.length > 0 && (
            <View style={styles.customizationsList}>
              {item.customizations.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.customizationGroup}>
                  <Text style={[styles.customizationGroupName, { color: colors.text }]}>
                    {group.groupName}:
                  </Text>
                  {group.selections.map((selection, selectionIndex) => (
                    <Text key={selectionIndex} style={[styles.customizationItem, { color: colors.textSecondary }]}>
                      • {selection.name}
                      {selection.price > 0 && (
                        <Text style={{ color: colors.septenary }}>
                          {' '}+{formatCurrency(selection.price)}
                        </Text>
                      )}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderCouponSection = () => (
    <View style={[styles.couponSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Promo Code
      </Text>

      {coupon ? (
        <View style={styles.appliedCoupon}>
          <View style={styles.couponInfo}>
            <Icon name="checkmark-circle" size={16} color="#10B981" />
            <View style={styles.couponDetails}>
              <Text style={[styles.couponCode, { color: colors.text }]}>
                {coupon.code}
              </Text>
              <Text style={[styles.couponDescription, { color: colors.textSecondary }]}>
                {coupon.description}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeCouponButton}
            onPress={handleRemoveCoupon}
          >
            <Icon name="close-circle" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.couponInput}>
          <Input
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="Enter promo code"
            leftIcon="pricetag-outline"
            style={styles.couponInputField}
          />
          <TouchableOpacity
            style={[styles.applyCouponButton, { backgroundColor: colors.septenary }]}
            onPress={handleApplyCoupon}
          >
            <Text style={[styles.applyCouponText, { color: colors.text }]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={[styles.orderSummary, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Order Summary
      </Text>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Subtotal ({cartItems.length} items)
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(subtotal)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Delivery Fee
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(deliveryFee)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Tax
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(tax)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: '#10B981' }]}>
            Discount
          </Text>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}

      <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

      <View style={styles.summaryRow}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.septenary }]}>
          {formatCurrency(total)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Icon name="cart-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyCartTitle, { color: colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptyCartDescription, { color: colors.textSecondary }]}>
        Add some delicious items from your favorite restaurants
      </Text>

      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.septenary }]}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={[styles.browseButtonText, { color: colors.text }]}>
          Browse Restaurants
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBottomBar = () => (
    <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
      <View style={styles.bottomBarLeft}>
        <Text style={[styles.bottomBarTotal, { color: colors.text }]}>
          {formatCurrency(total)}
        </Text>
        <Text style={[styles.bottomBarItems, { color: colors.textSecondary }]}>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          { backgroundColor: cartItems.length > 0 ? colors.septenary : 'rgba(255,255,255,0.1)' }
        ]}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      >
        <Text style={[
          styles.checkoutButtonText,
          { color: cartItems.length > 0 ? colors.text : colors.textTertiary }
        ]}>
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Cart
          </Text>
          <View style={styles.headerRight} />
        </View>

        {renderEmptyCart()}
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Cart ({cartItems.length})
        </Text>

        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert(
                'Clear Cart',
                'Are you sure you want to clear your entire cart?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', onPress: () => dispatch(clearCart()) },
                ]
              );
            }}
          >
            <Icon name="trash-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.cartList}
        />

        {renderCouponSection()}
        {renderOrderSummary()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderBottomBar()}
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
  headerRight: {
    width: 40,
    height: 40,
  },
  clearButton: {
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
    paddingBottom: 120,
  },
  cartList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cartItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  quantityControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    minWidth: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  customizationsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customizationsText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  customizationsList: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.2)',
  },
  customizationGroup: {
    marginBottom: 8,
  },
  customizationGroupName: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 4,
  },
  customizationItem: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginLeft: 8,
    marginBottom: 2,
  },
  couponSection: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 12,
  },
  couponInput: {
    flexDirection: 'row',
    gap: 12,
  },
  couponInputField: {
    flex: 1,
  },
  applyCouponButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyCouponText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  couponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  couponDetails: {
    flex: 1,
  },
  couponCode: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 2,
  },
  couponDescription: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  removeCouponButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderSummary: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Semibold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartDescription: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  bottomPadding: {
    height: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomBarTotal: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
  },
  bottomBarItems: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: 2,
  },
  checkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default CartScreen;