export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  cuisineType: CuisineType;
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3 | 4;
  deliveryTime: {
    min: number;
    max: number;
  };
  deliveryFee: number;
  minOrderAmount: number;
  image: string;
  images: string[];
  address: Address;
  coordinates: Coordinates;
  phone: string;
  email: string;
  website?: string;
  hours: OperatingHours;
  features: RestaurantFeature[];
  isFeatured: boolean;
  isTrending: boolean;
  isOpen: boolean;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  restaurantCount: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isKosher: boolean;
  spicyLevel: 0 | 1 | 2 | 3;
  preparationTime: number;
  calories?: number;
  allergens: string[];
  ingredients: string[];
  customizations: CustomizationOption[];
  nutrition: NutritionInfo;
  tags: string[];
  rating: number;
  reviewCount: number;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  maxSelections?: number;
  options: CustomizationChoice[];
}

export interface CustomizationChoice {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  itemId?: string;
  orderId: string;
  rating: number;
  comment: string;
  images: string[];
  helpfulCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    avatar?: string;
  };
}

export interface RestaurantSearchFilters {
  query?: string;
  cuisine?: string[];
  priceRange?: number[];
  rating?: number;
  deliveryTime?: number;
  distance?: number;
  features?: string[];
  dietary?: string[];
  sortBy?: 'relevance' | 'rating' | 'deliveryTime' | 'price' | 'distance';
  isOpen?: boolean;
  featured?: boolean;
  trending?: boolean;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Enums
export type CuisineType =
  | 'american'
  | 'italian'
  | 'chinese'
  | 'japanese'
  | 'mexican'
  | 'indian'
  | 'thai'
  | 'french'
  | 'mediterranean'
  | 'korean'
  | 'vietnamese'
  | 'greek'
  | 'spanish'
  | 'middle-eastern'
  | 'caribbean'
  | 'african'
  | 'fusion'
  | 'other';

export type RestaurantFeature =
  | 'delivery'
  | 'pickup'
  | 'reservations'
  | 'outdoor-seating'
  | 'wifi'
  | 'parking'
  | 'credit-cards'
  | 'apple-pay'
  | 'google-pay'
  | 'halal'
  | 'kosher'
  | 'vegetarian-friendly'
  | 'vegan-options'
  | 'gluten-free-options';

// Supporting types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  opens: string;
  closes: string;
  isClosed: boolean;
}