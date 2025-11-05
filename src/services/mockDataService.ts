// Mock data service for development and testing
import { User } from '@types/auth';
import { Restaurant, MenuItem } from '@types/restaurant';
import { CartItem } from '@types/cart';

export interface MockUserData {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

interface CartRestaurant {
  id: string;
  name: string;
  image: string;
  deliveryFee: number;
  minOrderAmount: number;
  deliveryTime: {
    min: number;
    max: number;
  };
}

interface MockRestaurantData {
  users: User[];
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  cartItems: CartItem[];
  categories: {
    id: string;
    name: string;
    icon: string;
    restaurantCount: number;
    description: string;
    image: string;
  }[];
  cities: {
    id: string;
    name: string;
    state: string;
    restaurantCount: number;
  }[];
}

class MockDataService {
  // User data
  private users: MockUserData[] = [
    {
      id: 'user_1',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      avatar: 'https://i.pravatar.cc/150/150?imgu=john.doe&s=400&gravatar_id=john.doe',
      dateOfBirth: '1990-01-15T00:00:00.000Z',
      emailVerified: true,
      phoneVerified: true,
      marketingConsent: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00.000Z',
      preferences: {
        notifications: {
          push: true,
          email: false,
          sms: false,
          orderUpdates: true,
          promotions: true,
        },
        dietary: {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          halal: false,
          kosher: false,
        },
        language: 'en',
        currency: 'USD',
      },
    },
    },
    {
      id: 'user_2',
      email: 'jane.smith@example.com',
      fullName: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1 (555) 987-6543',
      avatar: 'https://i.pravatar.cc/avatar/jane.jpg',
      dateOfBirth: '1985-05-23T00:00:00.000Z',
      emailVerified: true,
      phoneVerified: true,
      marketingConsent: false,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00.000Z',
      preferences: {
        notifications: {
          push: true,
          email: true,
          sms: false,
          orderUpdates: true,
          promotions: false,
        },
        dietary: {
          vegetarian: true,
          vegan: false,
          glutenFree: false,
          halal: false,
          kosher: false,
        },
        language: 'en',
        currency: 'USD',
      },
    },
    },
  ];

  // Restaurant data
  private restaurants: Restaurant[] = [
    {
      id: 'restaurant_1',
      name: 'Bella Italia Ristorante',
      description: 'Authentic Italian cuisine with fresh ingredients',
      cuisine: ['Italian', 'Pizza', 'Pasta', 'Salads'],
      rating: 4.5,
      reviewCount: 342,
      priceRange: 3,
      deliveryTime: { min: 30, max: 45 },
      deliveryFee: 2.99,
      minOrderAmount: 15,
      image: 'https://example.com/restaurant.jpg',
      images: [
        'https://example.com/pizza1.jpg',
        'https://example.com/pizza2.jpg',
        'https://example.com/pizza3.jpg',
      ],
      address: '123 Main St, New York, NY 10001',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      phone: '+1 (555) 123-4567',
      website: 'https://bellaristorante.com',
      hours: {
        monday: { opens: '11:00', closes: '22:00' },
        tuesday: { opens: '11:00', closes: '22:00' },
        wednesday: { opens: '11:00', closes: '22:00' },
        thursday: { opens: '11:00', closes: '22:00' },
        friday: { opens: '11:00', closes: '23:00' },
        saturday: { opens: '11:00', closes: '23:00' },
        sunday: { opens: '12:00', closes: '22:00' },
      },
      features: ['delivery', 'pickup', 'reservations', 'credit-cards', 'apple-pay', 'google-pay'],
      featured: true,
      trending: false,
      open: true,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'restaurant_2',
      name: 'Spice Garden',
      description: 'Authentic Indian flavors with modern twist',
      cuisine: ['Indian', 'Chinese', 'Thai', 'Continental', 'Asian', 'Malaysian'],
      rating: 4.8,
      reviewCount: 156,
      priceRange: 2,
      deliveryTime: { min: 25, max: 40 },
      deliveryFee: 1.99,
      minOrderAmount: 12,
      image: 'https://example.com/spice.jpg',
      images: [
        'https://example.com/spice1.jpg',
        'https://example.com/spice2.jpg',
        'https://example.com/spice3.jpg',
      ],
      address: '456 Curry Lane, New York, NY 10002',
      coordinates: { latitude: 40.758, longitude: -73.9855 },
      phone: '+1 (555) 987-6543',
      website: 'https://spicegarden.com',
      hours: {
        monday: { opens: '10:30', closes: '21:00' },
        tuesday: { opens: '10:30', closes: '21:00' },
        wednesday: { opens: '10:30', closes: '21:00' },
        thursday: { opens: '10:30', closes: '21:00' },
        friday: { opens: '11:00', closes: '23:00' },
        saturday: { opens: '11:30', closes: '23:00' },
        sunday: { opens: '11:30', closes: '21:00' },
      },
      features: ['vegetarian-friendly', 'halal', 'credit-cards', 'digital-wallet'],
      trending: false,
      open: true,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'restaurant_3',
      name: 'The Coffee House',
      description: 'Specialty coffee and pastries',
      cuisine: ['Coffee', 'Cafe', 'Breakfast', 'Desserts', 'Pastries'],
      rating: 4.7,
      reviewCount: 89,
      priceRange: 2,
      deliveryTime: { min: 5, max: 15 },
      deliveryFee: 0.99,
      minOrderAmount: 5,
      image: 'https://example.com/cafe1.jpg',
      images: [
        'https://example.com/cafe1.jpg',
        'https://example.com/cafe2.jpg',
        'https://example.com/cafe3.jpg',
      ],
      address: '789 Coffee St, New York, NY 10003',
      coordinates: { latitude: 40.750, longitude: -73.980 },
      phone: '+1 (555) 234-5678',
      website: 'https://thecoffeclub.com',
      hours: {
        monday: { opens: '6:00', closes: '22:00' },
        tuesday: { opens: '6:00', closes: '22:00' },
        wednesday: { opens: '6:00', closes: '22:00' },
        thursday: { opens: '6:00', closes: '22:00' },
        friday: { opens: '11:00', closes: '23:00' },
        saturday: { opens: '11:00', closes: '23:00' },
        sunday: { opens: '11:00', closes: '22:00' },
      },
      features: ['wifi', 'credit-cards', 'digital-wallet', 'dine-in', 'takeout'],
      trending: false,
      open: true,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  // Menu items for each restaurant
  private menuItems: { [restaurantId: string][] } = {
    'restaurant_1': mockMenuItems.filter(item => item.restaurantId === 'restaurant_1'),
    'restaurant_2': mockMenuItems.filter(item => item.restaurantId === 'restaurant_2'),
    'restaurant_3': mockMenuItems.filter(item => item.restaurantId === 'restaurant_3'),
    'restaurant_4': mockMenuItems.filter(item => item.restaurantId === 'restaurant_4'),
  };

  // Mock data helpers
  getUsers(): MockUserData[] {
    return this.users;
  }

  getUsers(): MockUserData[] {
    return this.users;
  }

  getRestaurant(id: string): Restaurant | undefined {
    return this.restaurants.find(restaurant => restaurant.id === id);
  }

  getRestaurantByCuisine(cuisine: string): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.cuisine.includes(cuisine));
  }

  getRestaurantByRating(minRating: number): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.rating >= minRating);
  }

  getTrendingRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.trending);
  }

  getFeaturedRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.featured);
  }

  getOpenRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.status === 'active' && restaurant.open);
  }

  getClosedRestaurants(): Restaurant[] {
    return this.restaurants.filter(restaurant => restaurant.status !== 'active');
  }

  // Menu items for each restaurant
  getMenuItems(restaurantId: string): MenuItem[] {
    const items = this.menuItems[restaurantId] || [];
    return items;
  }

  // Search and filter methods
  searchRestaurants(query?: string, filters?: any): Restaurant[] {
    let filtered = this.restaurants;

    if (query) {
      filtered = this.searchRestaurantsByQuery(query);
    }

    if (filters) {
      if (filters.cuisine && filters.cuisine && filters.cuisine.length > 0) {
      filtered = filtered.filter(restaurant => filters.cuisine.some(cuisine => restaurant.cuisine.includes(cuisine));
    }

      if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(restaurant => restaurant.rating >= filters.rating);
    }

      if (filters.deliveryTime && filters.deliveryTime) {
          if (filters.deliveryTime.max) {
            filtered = filtered.filter(restaurant => restaurant.deliveryTime.max === filters.deliveryTime.max);
          }
          filtered = filtered.filter(restaurant => restaurant.deliveryTime.min >= filters.deliveryTime.min && restaurant.deliveryTime.max <= filters.deliveryTime.max);
        } else {
          filtered = filtered.filter(restaurant => restaurant.deliveryTime.min >= filters.deliveryTime.min);
        }
      }

      if (filters.priceRange && filters.priceRange && filters.priceRange.length > 0) {
          filtered = filtered.filter(restaurant => {
            return restaurant.priceRange === filters.priceRange[0];
          });
        } else {
          filtered = filtered.filter(restaurant =>
            restaurant.priceRange >= filters.priceRange[0] && restaurant.priceRange <= filters.priceRange[filters.priceRange.length - 1]);
          });
        }
      }
    }

    return filtered;
  }

  private searchRestaurantsByQuery(query: string): Restaurant[] {
    const queryLower = query.toLowerCase();
    return this.restaurants.filter(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(queryLower) || restaurant.cuisine.some(cuisine.toLowerCase().includes(queryLower));
      return queryLower.split(' ').every(word => restaurant.name.toLowerCase().includes(word));
    });
  }

  // Cart calculations
  calculateCartTotals(cart: Cart): any {
    const cartItems = cart.items;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    const deliveryFee = cart.restaurant?.deliveryFee || 0;
    const taxes = subtotal * 0.08; // 8% sales tax rate
    const discount = cart.promoCode ? this.calculateDiscount(cart.subtotal, cart.promoCode) : 0;

    return {
      subtotal,
      deliveryFee,
      serviceFee: cart.serviceFee || (subtotal > 0 ? 2.99 : 0),
      taxes,
      discount,
      total: subtotal + deliveryFee + serviceFee + taxes + discount,
    };
  }

  calculateDiscount(subtotal: number, promoCode: PromoCode | null): number {
    switch (promoCode.type) {
      case 'percentage':
        return Math.min(subtotal * (promoCode.value / 100), promoCode.maxDiscountAmount || Infinity);
      case 'fixed':
        return Math.min(promoCode.value, subtotal);
      case 'free-delivery':
        return cart.deliveryFee || 0;
      default:
        return 0;
    }
  }

  applyPromoCode(code: string, restaurantId: string): Promise<PromoCode> | null> {
    const validPromoCodes = [
      { id: 'SAVE10', discount: 0.1, description: '10% off your order', type: 'percentage', minOrderAmount: 10 },
      { id: 'SAVE20', discount: 0.2, description: '20% off your order', type: 'percentage', minOrderAmount: 15 },
      { id: 'FREE-DELIVERY', discount: 0, description: 'Free delivery on all orders', type: 'free-delivery', minOrderAmount: 0 },
      { id: 'WELCOME15', discount: 0.15, description: 'Welcome15% off your first order', type: 'percentage', minOrderAmount: 5 },
    ];

    return validPromoCodes.find(pc => pc.code === code) || null;
  }

  clearPromoCode(): void {
    if (this.promoCode) {
      this.promoCode = null;
    }
  }

  validateCart(cart: Cart): CartValidation {
    const cartValidation: CartValidation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!cart.items || cart.items.length === 0) {
      return { ...cartValidation, isValid: false, errors: ['Cart is empty'], warnings: [] };
    }

    // Check for common validation errors
    const warnings: CartValidation['warnings'] = [];

    // Check for potential issues
    const cartValidation = { ...cartValidation };

    return cartValidation;
  }
}

  clearCart(): void {
  // In real app, this would clear cart from API
  // For now, just clear local state
  this.items = [];
  this.cart = null;
  }


  getCurrentCart(): Cart | null {
    return this.cart || null;
  }

  getCartItemCount(): number {
    return this.cart?.items.length || 0;
  }

  updateCart(cart: Cart): void {
    // Update local state immediately for optimistic updates
    if (this.cart && this.cart.id === cart.id) {
      // Update existing cart
      this.cart = { ...this.cart, ...cart, ...cart, updatedAt: new Date.now().toISOString() };
    } else if (this.cart?.id) {
      // Replace cart entirely if restaurant is different
      this.cart = cart;
    } else {
      // Create new cart
      this.cart = cart;
    }
  }

  setCart(cart: Cart): void {
    // Replace cart with new cart
    this.cart = cart;
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;