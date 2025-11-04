import {
  Restaurant,
  Category,
  MenuItem,
  Review,
  User,
  Order,
  CartItem,
  Address,
} from '@types/index';

// Mock data for development and testing
class MockDataService {
  private restaurants: Restaurant[] = [];
  private categories: Category[] = [];
  private menuItems: MenuItem[] = [];
  private reviews: Review[] = [];
  private users: User[] = [];
  private orders: Order[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.generateCategories();
    this.generateRestaurants();
    this.generateMenuItems();
    this.generateReviews();
    this.generateUsers();
  }

  private generateCategories() {
    this.categories = [
      {
        id: 'cat-1',
        name: 'Italian',
        description: 'Authentic Italian cuisine',
        icon: '🍝',
        image: 'https://example.com/italian.jpg',
        restaurantCount: 12,
      },
      {
        id: 'cat-2',
        name: 'Japanese',
        description: 'Traditional Japanese dishes',
        icon: '🍱',
        image: 'https://example.com/japanese.jpg',
        restaurantCount: 8,
      },
      {
        id: 'cat-3',
        name: 'Mexican',
        description: 'Spicy Mexican flavors',
        icon: '🌮',
        image: 'https://example.com/mexican.jpg',
        restaurantCount: 15,
      },
      {
        id: 'cat-4',
        name: 'American',
        description: 'Classic American food',
        icon: '🍔',
        image: 'https://example.com/american.jpg',
        restaurantCount: 20,
      },
      {
        id: 'cat-5',
        name: 'Thai',
        description: 'Aromatic Thai cuisine',
        icon: '🍜',
        image: 'https://example.com/thai.jpg',
        restaurantCount: 6,
      },
      {
        id: 'cat-6',
        name: 'Indian',
        description: 'Flavorful Indian dishes',
        icon: '🍛',
        image: 'https://example.com/indian.jpg',
        restaurantCount: 10,
      },
      {
        id: 'cat-7',
        name: 'Chinese',
        description: 'Traditional Chinese food',
        icon: '🥟',
        image: 'https://example.com/chinese.jpg',
        restaurantCount: 18,
      },
      {
        id: 'cat-8',
        name: 'Mediterranean',
        description: 'Healthy Mediterranean options',
        icon: '🥗',
        image: 'https://example.com/mediterranean.jpg',
        restaurantCount: 7,
      },
    ];
  }

  private generateRestaurants() {
    this.restaurants = [
      {
        id: 'rest-1',
        name: 'Bella Vista Italian',
        description: 'Authentic Italian cuisine with a modern twist',
        cuisine: ['italian', 'pasta', 'pizza'],
        cuisineType: 'italian',
        rating: 4.7,
        reviewCount: 324,
        priceRange: 3,
        deliveryTime: { min: 25, max: 40 },
        deliveryFee: 2.99,
        minOrderAmount: 15,
        image: 'https://example.com/bella-vista.jpg',
        images: [
          'https://example.com/bella-vista-1.jpg',
          'https://example.com/bella-vista-2.jpg',
          'https://example.com/bella-vista-3.jpg',
        ],
        address: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA',
          fullAddress: '123 Main St, San Francisco, CA 94102',
        },
        coordinates: { latitude: 37.7749, longitude: -122.4194 },
        phone: '+1 (555) 123-4567',
        email: 'info@bellavista.com',
        hours: {
          monday: { opens: '11:00', closes: '22:00', isClosed: false },
          tuesday: { opens: '11:00', closes: '22:00', isClosed: false },
          wednesday: { opens: '11:00', closes: '22:00', isClosed: false },
          thursday: { opens: '11:00', closes: '22:00', isClosed: false },
          friday: { opens: '11:00', closes: '23:00', isClosed: false },
          saturday: { opens: '11:00', closes: '23:00', isClosed: false },
          sunday: { opens: '12:00', closes: '21:00', isClosed: false },
        },
        features: ['delivery', 'pickup', 'credit-cards', 'apple-pay'],
        isFeatured: true,
        isTrending: true,
        isOpen: true,
        status: 'active',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'rest-2',
        name: 'Sakura Sushi House',
        description: 'Fresh, authentic Japanese sushi and sashimi',
        cuisine: ['japanese', 'sushi', 'asian'],
        cuisineType: 'japanese',
        rating: 4.9,
        reviewCount: 567,
        priceRange: 4,
        deliveryTime: { min: 30, max: 45 },
        deliveryFee: 3.99,
        minOrderAmount: 25,
        image: 'https://example.com/sakura-sushi.jpg',
        images: [
          'https://example.com/sakura-sushi-1.jpg',
          'https://example.com/sakura-sushi-2.jpg',
        ],
        address: {
          street: '456 Oak Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA',
          fullAddress: '456 Oak Ave, San Francisco, CA 94103',
        },
        coordinates: { latitude: 37.7849, longitude: -122.4094 },
        phone: '+1 (555) 987-6543',
        email: 'hello@sakurasushi.com',
        hours: {
          monday: { opens: '11:30', closes: '14:30', isClosed: false },
          tuesday: { opens: '11:30', closes: '14:30', isClosed: false },
          wednesday: { opens: '11:30', closes: '14:30', isClosed: false },
          thursday: { opens: '11:30', closes: '14:30', isClosed: false },
          friday: { opens: '11:30', closes: '22:00', isClosed: false },
          saturday: { opens: '12:00', closes: '22:00', isClosed: false },
          sunday: { opens: '12:00', closes: '21:00', isClosed: false },
        },
        features: ['delivery', 'pickup', 'credit-cards', 'apple-pay', 'google-pay'],
        isFeatured: true,
        isTrending: false,
        isOpen: true,
        status: 'active',
        createdAt: '2023-03-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
      },
      {
        id: 'rest-3',
        name: 'Taco Fiesta',
        description: 'Colorful and delicious Mexican street food',
        cuisine: ['mexican', 'tacos', 'burritos'],
        cuisineType: 'mexican',
        rating: 4.5,
        reviewCount: 189,
        priceRange: 2,
        deliveryTime: { min: 20, max: 35 },
        deliveryFee: 1.99,
        minOrderAmount: 12,
        image: 'https://example.com/taco-fiesta.jpg',
        images: [
          'https://example.com/taco-fiesta-1.jpg',
          'https://example.com/taco-fiesta-2.jpg',
          'https://example.com/taco-fiesta-3.jpg',
        ],
        address: {
          street: '789 Pine St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94104',
          country: 'USA',
          fullAddress: '789 Pine St, San Francisco, CA 94104',
        },
        coordinates: { latitude: 37.7649, longitude: -122.4294 },
        phone: '+1 (555) 456-7890',
        email: 'orders@tacofiesta.com',
        hours: {
          monday: { opens: '10:00', closes: '23:00', isClosed: false },
          tuesday: { opens: '10:00', closes: '23:00', isClosed: false },
          wednesday: { opens: '10:00', closes: '23:00', isClosed: false },
          thursday: { opens: '10:00', closes: '23:00', isClosed: false },
          friday: { opens: '10:00', closes: '00:00', isClosed: false },
          saturday: { opens: '10:00', closes: '00:00', isClosed: false },
          sunday: { opens: '10:00', closes: '22:00', isClosed: false },
        },
        features: ['delivery', 'pickup', 'credit-cards'],
        isFeatured: false,
        isTrending: true,
        isOpen: true,
        status: 'active',
        createdAt: '2023-05-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
    ];
  }

  private generateMenuItems() {
    this.menuItems = [
      // Bella Vista Menu Items
      {
        id: 'item-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
        price: 14.99,
        image: 'https://example.com/margherita.jpg',
        images: ['https://example.com/margherita-1.jpg'],
        category: 'Pizza',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isHalal: false,
        isKosher: false,
        spicyLevel: 0,
        preparationTime: 15,
        calories: 850,
        allergens: ['wheat', 'dairy'],
        ingredients: ['flour', 'tomatoes', 'mozzarella', 'basil', 'olive oil'],
        customizations: [
          {
            id: 'cust-1',
            name: 'Extra Toppings',
            type: 'multiple',
            required: false,
            maxSelections: 3,
            options: [
              { id: 'opt-1', name: 'Extra Cheese', price: 2.00, isAvailable: true },
              { id: 'opt-2', name: 'Pepperoni', price: 3.00, isAvailable: true },
              { id: 'opt-3', name: 'Mushrooms', price: 1.50, isAvailable: true },
            ],
          },
        ],
        nutrition: {
          calories: 850,
          protein: 35,
          carbs: 95,
          fat: 38,
          fiber: 6,
          sugar: 8,
          sodium: 1200,
        },
        tags: ['vegetarian', 'popular', 'classic'],
        rating: 4.6,
        reviewCount: 124,
        orderCount: 543,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'item-2',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan',
        price: 16.99,
        image: 'https://example.com/carbonara.jpg',
        images: ['https://example.com/carbonara-1.jpg'],
        category: 'Pasta',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isHalal: false,
        isKosher: false,
        spicyLevel: 0,
        preparationTime: 12,
        calories: 720,
        allergens: ['wheat', 'dairy', 'eggs'],
        ingredients: ['spaghetti', 'bacon', 'eggs', 'parmesan', 'black pepper'],
        customizations: [],
        nutrition: {
          calories: 720,
          protein: 42,
          carbs: 68,
          fat: 38,
          fiber: 4,
          sugar: 6,
          sodium: 980,
        },
        tags: ['popular', 'creamy'],
        rating: 4.7,
        reviewCount: 89,
        orderCount: 321,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      // Sakura Sushi Menu Items
      {
        id: 'item-3',
        restaurantId: 'rest-2',
        categoryId: 'cat-2',
        name: 'Salmon Nigiri Set',
        description: '6 pieces of fresh salmon nigiri sushi',
        price: 18.99,
        image: 'https://example.com/salmon-nigiri.jpg',
        images: ['https://example.com/salmon-nigiri-1.jpg'],
        category: 'Nigiri',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isHalal: false,
        isKosher: false,
        spicyLevel: 0,
        preparationTime: 8,
        calories: 320,
        allergens: ['fish'],
        ingredients: ['salmon', 'sushi rice', 'wasabi', 'soy sauce'],
        customizations: [
          {
            id: 'cust-2',
            name: 'Wasabi Amount',
            type: 'single',
            required: false,
            options: [
              { id: 'opt-4', name: 'No Wasabi', price: 0, isAvailable: true },
              { id: 'opt-5', name: 'Regular', price: 0, isAvailable: true },
              { id: 'opt-6', name: 'Extra Wasabi', price: 0.50, isAvailable: true },
            ],
          },
        ],
        nutrition: {
          calories: 320,
          protein: 28,
          carbs: 42,
          fat: 8,
          fiber: 2,
          sugar: 1,
          sodium: 680,
        },
        tags: ['gluten-free', 'popular', 'fresh'],
        rating: 4.9,
        reviewCount: 234,
        orderCount: 678,
        createdAt: '2023-03-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
      },
    ];
  }

  private generateReviews() {
    this.reviews = [
      {
        id: 'review-1',
        userId: 'user-1',
        restaurantId: 'rest-1',
        orderId: 'order-1',
        rating: 5,
        comment: 'Absolutely amazing food! The pizza was perfectly cooked and delivery was fast.',
        images: ['https://example.com/review-1.jpg'],
        helpfulCount: 23,
        isVerified: true,
        createdAt: '2024-01-10T18:30:00Z',
        updatedAt: '2024-01-10T18:30:00Z',
        user: {
          id: 'user-1',
          fullName: 'John Doe',
          avatar: 'https://example.com/avatar-1.jpg',
        },
      },
      {
        id: 'review-2',
        userId: 'user-2',
        restaurantId: 'rest-2',
        orderId: 'order-2',
        rating: 4,
        comment: 'Great sushi, very fresh. Delivery took a bit longer than expected but food was worth it.',
        images: [],
        helpfulCount: 15,
        isVerified: true,
        createdAt: '2024-01-08T19:45:00Z',
        updatedAt: '2024-01-08T19:45:00Z',
        user: {
          id: 'user-2',
          fullName: 'Jane Smith',
          avatar: 'https://example.com/avatar-2.jpg',
        },
      },
    ];
  }

  private generateUsers() {
    this.users = [
      {
        id: 'user-1',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        avatar: 'https://example.com/avatar-1.jpg',
        emailVerified: true,
        phoneVerified: true,
        marketingConsent: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        preferences: {
          notifications: {
            push: true,
            email: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
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
      {
        id: 'user-2',
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 987-6543',
        avatar: 'https://example.com/avatar-2.jpg',
        emailVerified: true,
        phoneVerified: false,
        marketingConsent: false,
        createdAt: '2023-02-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        preferences: {
          notifications: {
            push: true,
            email: false,
            sms: true,
            orderUpdates: true,
            promotions: true,
          },
          dietary: {
            vegetarian: true,
            vegan: false,
            glutenFree: true,
            halal: false,
            kosher: false,
          },
          language: 'en',
          currency: 'USD',
        },
      },
    ];
  }

  // Public methods to access mock data
  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getMenuItems(restaurantId: string): MenuItem[] {
    return this.menuItems.filter(item => item.restaurantId === restaurantId);
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.restaurants.find(restaurant => restaurant.id === id);
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find(item => item.id === id);
  }

  getReviews(restaurantId: string): Review[] {
    return this.reviews.filter(review => review.restaurantId === restaurantId);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Search functionality
  searchRestaurants(query: string): Restaurant[] {
    const lowerQuery = query.toLowerCase();
    return this.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.description.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(lowerQuery))
    );
  }

  // Generate random data
  generateRandomOrders(count: number): Order[] {
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
      // Generate random order logic here
      // This would create mock order data
    }
    return orders;
  }

  generateRandomAddresses(count: number): Address[] {
    const addresses: Address[] = [];
    for (let i = 0; i < count; i++) {
      // Generate random address logic here
      // This would create mock address data
    }
    return addresses;
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;