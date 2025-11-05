import { MenuItem, CustomizationOption } from './restaurant';

export interface CartItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  customizations: SelectedCustomization[];
  totalPrice: number;
  addedAt: string;
}

export interface SelectedCustomization {
  optionId: string;
  optionName: string;
  choiceIds: string[];
  choices: SelectedChoice[];
  totalPrice: number;
}

export interface SelectedChoice {
  id: string;
  name: string;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: CartRestaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxes: number;
  promoCode?: PromoCode;
  discount: number;
  tip: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartRestaurant {
  id: string;
  name: string;
  image: string;
  deliveryFee: number;
  minOrderAmount: number;
  deliveryTime: {
    min: number;
    max: number;
  };
  address: string;
  distance: number;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free-delivery';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  applicableRestaurants: string[];
  applicableItems: string[];
  usageLimit?: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface AddToCartRequest {
  menuItemId: string;
  quantity: number;
  customizations?: SelectedCustomization[];
  specialInstructions?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  customizations?: SelectedCustomization[];
  specialInstructions?: string;
}

export interface ApplyPromoRequest {
  code: string;
  restaurantId: string;
}

export interface CartCalculation {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  tip: number;
  total: number;
  breakdown: PriceBreakdown[];
}

export interface PriceBreakdown {
  label: string;
  amount: number;
  type: 'positive' | 'negative';
}

// Cart validation
export interface CartValidation {
  isValid: boolean;
  errors: CartValidationError[];
  warnings: CartValidationWarning[];
}

export interface CartValidationError {
  type: 'item-unavailable' | 'restaurant-closed' | 'min-order' | 'delivery-radius' | 'promo-expired';
  message: string;
  itemId?: string;
  field?: string;
}

export interface CartValidationWarning {
  type: 'price-changed' | 'longer-wait' | 'promo-expiring';
  message: string;
  itemId?: string;
}