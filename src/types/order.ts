import { CartItem, Cart } from './cart';
import { Address, Coordinates } from './restaurant';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: OrderRestaurant;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  deliveryCoordinates: Coordinates;
  orderType: OrderType;
  scheduledFor?: string;
  pricing: OrderPricing;
  timeline: OrderTimeline[];
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  driver?: Driver;
  tracking: TrackingInfo;
  notes?: string;
  rating?: OrderRating;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRestaurant {
  id: string;
  name: string;
  image: string;
  phone: string;
  address: string;
  rating: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: string[];
  specialInstructions?: string;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxes: number;
  promoDiscount: number;
  tip: number;
  total: number;
  currency: string;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  timestamp: string;
  note?: string;
  isCompleted: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicle: Vehicle;
  rating: number;
  completedDeliveries: number;
}

export interface Vehicle {
  type: 'car' | 'motorcycle' | 'bicycle';
  make: string;
  model: string;
  color: string;
  licensePlate: string;
}

export interface TrackingInfo {
  orderId: string;
  driverLocation?: Coordinates;
  restaurantLocation: Coordinates;
  deliveryLocation: Coordinates;
  estimatedArrival: string;
  distance: number;
  duration: number;
  lastUpdated: string;
}

export interface OrderRating {
  orderId: string;
  overallRating: number;
  foodRating: number;
  deliveryRating: number;
  packagingRating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: OrderItemRequest[];
  deliveryAddress: Address;
  orderType: OrderType;
  scheduledFor?: string;
  promoCode?: string;
  tip?: number;
  notes?: string;
  paymentMethodId: string;
}

export interface OrderItemRequest {
  menuItemId: string;
  quantity: number;
  customizations: any[];
  specialInstructions?: string;
}

export interface OrderUpdate {
  status: OrderStatus;
  note?: string;
  driverLocation?: Coordinates;
  estimatedArrival?: string;
}

export interface OrderSearchFilters {
  status?: OrderStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  restaurantId?: string;
  minAmount?: number;
  maxAmount?: number;
  rating?: number;
  sortBy?: 'date' | 'total' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  statistics: OrderStatistics;
}

export interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteRestaurant: string;
  mostOrderedItem: string;
  deliveryRate: number;
  averageRating: number;
}

// Enums
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked-up'
  | 'on-the-way'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially-refunded';

export type OrderType = 'delivery' | 'pickup';

// Real-time order tracking
export interface OrderTrackingUpdate {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  location?: Coordinates;
  estimatedArrival?: string;
  note?: string;
}

export interface WebSocketOrderMessage {
  type: 'order_update' | 'driver_location' | 'delivery_eta';
  orderId: string;
  data: OrderTrackingUpdate | Coordinates | string;
  timestamp: string;
}