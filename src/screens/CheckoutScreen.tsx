import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { placeOrder } from '@store/slices/orderSlice';
import { formatCurrency } from '@utils/index';
import { CartItem, DeliveryAddress, PaymentMethod } from '@types/index';

const CheckoutScreen: React.FC = () => {
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

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [processingOrder, setProcessingOrder] = useState(false);

  // Mock data for development
  const [addresses] = useState<DeliveryAddress[]>([
    {
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
    {
      id: '2',
      name: 'Work',
      street: '456 Business Ave',
      apartment: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false,
      coordinates: { latitude: 40.7580, longitude: -73.9855 },
    },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      cardNumber: '****4242',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard ending in 8888',
      cardNumber: '****8888',
      expiryDate: '09/24',
      isDefault: false,
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      email: 'user@example.com',
      isDefault: false,
    },
    {
      id: '4',
      type: 'apple-pay',
      name: 'Apple Pay',
      isDefault: false,
    },
  ]);

  useEffect(() => {
    // Auto-select default address and payment method
    const defaultAddress = addresses.find(addr => addr.isDefault);
    const defaultPayment = paymentMethods.find(pm => pm.isDefault);

    setSelectedAddress(defaultAddress || null);
    setSelectedPaymentMethod(defaultPayment || null);
  }, []);

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address');
      return;
    }
    if (currentStep === 2 && !selectedPaymentMethod) {
      Alert.alert('Payment Required', 'Please select a payment method');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      Alert.alert('Missing Information', 'Please complete all required fields');
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert('Phone Required', 'Please provide a contact phone number');
      return;
    }

    setProcessingOrder(true);

    try {
      const orderData = {
        id: `order_${Date.now()}`,
        items: cartItems,
        deliveryAddress: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        coupon,
        deliveryInstructions,
        contactPhone,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      };

      const result = await dispatch(placeOrder(orderData));

      if (placeOrder.fulfilled.match(result)) {
        Alert.alert(
          'Order Placed!',
          'Your order has been successfully placed. You can track its status in Order History.',
          [
            { text: 'Continue Shopping', style: 'cancel' },
            { text: 'Track Order', onPress: () => navigation.navigate('OrderTracking' as never, { orderId: orderData.id }) },
          ]
        );
      } else {
        Alert.alert('Order Failed', 'There was an issue placing your order. Please try again.');
      }
    } catch (error) {
      Alert.alert('Order Failed', 'There was an issue placing your order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
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
        Checkout
      </Text>

      <View style={styles.headerRight} />
    </View>
  );

  const renderProgressSteps = () => (
    <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
      {[1, 2, 3].map((step) => (
        <TouchableOpacity
          key={step}
          style={styles.progressStep}
          onPress={() => {
            if (step <= currentStep) {
              setCurrentStep(step);
            }
          }}
        >
          <View
            style={[
              styles.progressDot,
              {
                backgroundColor: step <= currentStep ? colors.septenary : 'rgba(255,255,255,0.3)',
                borderWidth: step <= currentStep ? 0 : 2,
                borderColor: colors.border,
              },
            ]}
          >
            {step < currentStep && (
              <Icon name="checkmark" size={12} color={colors.text} />
            )}
          </View>
          <Text
            style={[
              styles.progressLabel,
              { color: step <= currentStep ? colors.text : colors.textSecondary },
            ]}
          >
            {step === 1 ? 'Address' : step === 2 ? 'Payment' : 'Review'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={[styles.orderSummary, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Order Summary ({cartItems.length} items)
      </Text>

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Subtotal
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(subtotal)}
        </Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Delivery Fee
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(deliveryFee)}
        </Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Tax
        </Text>
        <Text style={[styles.summaryValue, { color: colors.text }]}>
          {formatCurrency(tax)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: '#10B981' }]}>
            Discount ({coupon?.code})
          </Text>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}

      <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

      <View style={styles.summaryItem}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.septenary }]}>
          {formatCurrency(total)}
        </Text>
      </View>
    </View>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Delivery Address
      </Text>

      {addresses.map((address) => (
        <TouchableOpacity
          key={address.id}
          style={[
            styles.addressCard,
            {
              backgroundColor: colors.surface,
              borderColor: selectedAddress?.id === address.id ? colors.septenary : colors.border,
            },
          ]}
          onPress={() => setSelectedAddress(address)}
        >
          <View style={styles.addressHeader}>
            <View style={styles.addressInfo}>
              <Text style={[styles.addressName, { color: colors.text }]}>
                {address.name}
              </Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <View
              style={[
                styles.radioButton,
                {
                  borderColor: selectedAddress?.id === address.id ? colors.septenary : colors.border,
                  backgroundColor: selectedAddress?.id === address.id ? colors.septenary : 'transparent',
                },
              ]}
            >
              {selectedAddress?.id === address.id && (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
          </View>

          <Text style={[styles.addressText, { color: colors.textSecondary }]}>
            {address.street}
            {address.apartment && `\n${address.apartment}`}
            {'\n'}
            {address.city}, {address.state} {address.zipCode}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addAddressButton}>
        <Icon name="add-circle-outline" size={20} color={colors.septenary} />
        <Text style={[styles.addAddressText, { color: colors.septenary }]}>
          Add New Address
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Payment Method
      </Text>

      {paymentMethods.map((payment) => (
        <TouchableOpacity
          key={payment.id}
          style={[
            styles.paymentCard,
            {
              backgroundColor: colors.surface,
              borderColor: selectedPaymentMethod?.id === payment.id ? colors.septenary : colors.border,
            },
          ]}
          onPress={() => setSelectedPaymentMethod(payment)}
        >
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentIcon}>
                {payment.type === 'card' && <Icon name="card" size={20} color={colors.textSecondary} />}
                {payment.type === 'paypal' && <Icon name="logo-paypal" size={20} color={colors.textSecondary} />}
                {payment.type === 'apple-pay' && <Icon name="logo-apple" size={20} color={colors.textSecondary} />}
              </View>
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentName, { color: colors.text }]}>
                  {payment.name}
                </Text>
                {payment.cardNumber && (
                  <Text style={[styles.paymentNumber, { color: colors.textSecondary }]}>
                    {payment.cardNumber}
                  </Text>
                )}
                {payment.expiryDate && (
                  <Text style={[styles.paymentExpiry, { color: colors.textSecondary }]}>
                    Expires {payment.expiryDate}
                  </Text>
                )}
              </View>
              {payment.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <View
              style={[
                styles.radioButton,
                {
                  borderColor: selectedPaymentMethod?.id === payment.id ? colors.septenary : colors.border,
                  backgroundColor: selectedPaymentMethod?.id === payment.id ? colors.septenary : 'transparent',
                },
              ]}
            >
              {selectedPaymentMethod?.id === payment.id && (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addPaymentButton}>
        <Icon name="add-circle-outline" size={20} color={colors.septenary} />
        <Text style={[styles.addPaymentText, { color: colors.septenary }]}>
          Add New Payment Method
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Review Order
      </Text>

      {selectedAddress && (
        <View style={[styles.reviewSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
            Delivery Address
          </Text>
          <Text style={[styles.reviewAddress, { color: colors.textSecondary }]}>
            {selectedAddress.name}
            {'\n'}
            {selectedAddress.street}
            {selectedAddress.apartment && `\n${selectedAddress.apartment}`}
            {'\n'}
            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
          </Text>
        </View>
      )}

      {selectedPaymentMethod && (
        <View style={[styles.reviewSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
            Payment Method
          </Text>
          <Text style={[styles.reviewPayment, { color: colors.textSecondary }]}>
            {selectedPaymentMethod.name}
            {selectedPaymentMethod.cardNumber && `\n${selectedPaymentMethod.cardNumber}`}
          </Text>
        </View>
      )}

      <View style={[styles.reviewSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
          Contact Phone
        </Text>
        <Input
          value={contactPhone}
          onChangeText={setContactPhone}
          placeholder="Phone number for delivery updates"
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />
      </View>

      <View style={[styles.reviewSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
          Delivery Instructions (Optional)
        </Text>
        <TextInput
          style={[styles.instructionsInput, {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border
          }]}
          value={deliveryInstructions}
          onChangeText={setDeliveryInstructions}
          placeholder="Any special instructions for delivery?"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {renderOrderSummary()}
    </View>
  );

  const renderBottomBar = () => (
    <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handlePreviousStep}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            Back
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: currentStep === 3 ? '#10B981' : colors.septenary }
        ]}
        onPress={currentStep === 3 ? handlePlaceOrder : handleNextStep}
        disabled={processingOrder}
      >
        <Text style={[styles.nextButtonText, { color: colors.text }]}>
          {processingOrder ? 'Processing...' : currentStep === 3 ? `Place Order • ${formatCurrency(total)}` : 'Continue'}
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
        {renderHeader()}
        <View style={styles.emptyCart}>
          <Icon name="cart-outline" size={80} color={colors.textTertiary} />
          <Text style={[styles.emptyCartTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptyCartDescription, { color: colors.textSecondary }]}>
            Add items to your cart to proceed with checkout
          </Text>
        </View>
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
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderProgressSteps()}
        {renderOrderSummary()}

        {currentStep === 1 && renderAddressStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}

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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
  },
  orderSummary: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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
  stepContent: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 16,
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: 'rgba(133, 71, 152, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Medium',
    color: '#854798',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#854798',
    borderStyle: 'dashed',
    gap: 8,
  },
  addAddressText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  paymentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 2,
  },
  paymentNumber: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 2,
  },
  paymentExpiry: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#854798',
    borderStyle: 'dashed',
    gap: 8,
  },
  addPaymentText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 8,
  },
  reviewAddress: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
  },
  reviewPayment: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 18,
  },
  instructionsInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    minHeight: 80,
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
    lineHeight: 20,
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
    gap: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default CheckoutScreen;