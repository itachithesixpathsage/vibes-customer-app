import { apiClient } from './apiClient';
import { mockDataService } from './mockDataService';
import {
  Restaurant,
  Category,
  MenuItem,
  Review,
  RestaurantSearchFilters,
  RestaurantListResponse,
} from '@types/restaurant';

class RestaurantService {
  private delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getRestaurants(params: {
    page?: number;
    limit?: number;
    filters?: RestaurantSearchFilters;
  }): Promise<RestaurantListResponse> {
    try {
      if (__DEV__) {
        await this.delay(600);

        const restaurants = mockDataService.getRestaurants();
        const page = params.page || 1;
        const limit = params.limit || 20;

        // Apply filters
        let filteredRestaurants = restaurants;

        if (params.filters?.query) {
          filteredRestaurants = mockDataService.searchRestaurants(params.filters.query);
        }

        if (params.filters?.cuisine?.length) {
          filteredRestaurants = filteredRestaurants.filter(r =>
            params.filters!.cuisine!.some(c => r.cuisine.includes(c))
          );
        }

        if (params.filters?.priceRange?.length) {
          filteredRestaurants = filteredRestaurants.filter(r =>
            params.filters!.priceRange!.includes(r.priceRange)
          );
        }

        if (params.filters?.rating) {
          filteredRestaurants = filteredRestaurants.filter(r => r.rating >= params.filters!.rating!);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

        return {
          restaurants: paginatedRestaurants,
          categories: mockDataService.getCategories(),
          total: filteredRestaurants.length,
          page,
          limit,
          hasMore: endIndex < filteredRestaurants.length,
        };
      }

      const response = await apiClient.get<RestaurantListResponse>('/restaurants', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch restaurants');
    }
  }

  async getRestaurantById(restaurantId: string): Promise<Restaurant> {
    try {
      if (__DEV__) {
        await this.delay(500);

        const restaurant = mockDataService.getRestaurantById(restaurantId);
        if (!restaurant) {
          throw new Error('Restaurant not found');
        }
        return restaurant;
      }

      const response = await apiClient.get<Restaurant>(`/restaurants/${restaurantId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch restaurant');
    }
  }

  async searchRestaurants(filters: RestaurantSearchFilters): Promise<RestaurantListResponse> {
    try {
      if (__DEV__) {
        await this.delay(700);

        const restaurants = mockDataService.getRestaurants();
        let filteredRestaurants = restaurants;

        // Apply search filters
        if (filters.query) {
          filteredRestaurants = mockDataService.searchRestaurants(filters.query);
        }

        if (filters.cuisine?.length) {
          filteredRestaurants = filteredRestaurants.filter(r =>
            filters.cuisine!.some(c => r.cuisine.includes(c))
          );
        }

        if (filters.priceRange?.length) {
          filteredRestaurants = filteredRestaurants.filter(r =>
            filters.priceRange!.includes(r.priceRange)
          );
        }

        if (filters.rating) {
          filteredRestaurants = filteredRestaurants.filter(r => r.rating >= filters.rating!);
        }

        if (filters.distance) {
          // Mock distance filtering (in real app, would use actual location calculations)
          filteredRestaurants = filteredRestaurants.filter(() => Math.random() > 0.3);
        }

        return {
          restaurants: filteredRestaurants,
          categories: mockDataService.getCategories(),
          total: filteredRestaurants.length,
          page: 1,
          limit: 20,
          hasMore: false,
        };
      }

      const response = await apiClient.get<RestaurantListResponse>('/restaurants/search', {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      if (__DEV__) {
        await this.delay(300);
        return mockDataService.getCategories();
      }

      const response = await apiClient.get<Category[]>('/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }

  async getFeatured(): Promise<Restaurant[]> {
    try {
      if (__DEV__) {
        await this.delay(400);
        return mockDataService.getRestaurants().filter(r => r.isFeatured);
      }

      const response = await apiClient.get<Restaurant[]>('/restaurants/featured');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch featured restaurants');
    }
  }

  async getTrending(): Promise<Restaurant[]> {
    try {
      if (__DEV__) {
        await this.delay(400);
        return mockDataService.getRestaurants().filter(r => r.isTrending);
      }

      const response = await apiClient.get<Restaurant[]>('/restaurants/trending');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trending restaurants');
    }
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      if (__DEV__) {
        await this.delay(500);
        return mockDataService.getMenuItems(restaurantId);
      }

      const response = await apiClient.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch menu items');
    }
  }

  async getReviews(restaurantId: string, page: number = 1): Promise<Review[]> {
    try {
      if (__DEV__) {
        await this.delay(400);
        const reviews = mockDataService.getReviews(restaurantId);
        const limit = 10;
        const startIndex = (page - 1) * limit;
        return reviews.slice(startIndex, startIndex + limit);
      }

      const response = await apiClient.get<Review[]>(`/restaurants/${restaurantId}/reviews`, {
        params: { page, limit: 10 },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch reviews');
    }
  }

  async addToFavorites(restaurantId: string): Promise<void> {
    try {
      if (__DEV__) {
        await this.delay(300);
        return;
      }

      await apiClient.post(`/restaurants/${restaurantId}/favorite`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add to favorites');
    }
  }

  async removeFromFavorites(restaurantId: string): Promise<void> {
    try {
      if (__DEV__) {
        await this.delay(300);
        return;
      }

      await apiClient.delete(`/restaurants/${restaurantId}/favorite`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove from favorites');
    }
  }

  async getFavorites(): Promise<string[]> {
    try {
      if (__DEV__) {
        await this.delay(400);
        // Return some favorite restaurant IDs
        return mockDataService.getRestaurants().slice(0, 2).map(r => r.id);
      }

      const response = await apiClient.get<string[]>('/restaurants/favorites');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch favorites');
    }
  }

  async submitReview(
    restaurantId: string,
    review: {
      rating: number;
      comment?: string;
      images?: string[];
    }
  ): Promise<Review> {
    try {
      if (__DEV__) {
        await this.delay(600);
        const newReview: Review = {
          id: 'review-' + Date.now(),
          userId: 'user-1',
          restaurantId,
          orderId: 'order-' + Date.now(),
          rating: review.rating,
          comment: review.comment,
          images: review.images || [],
          helpfulCount: 0,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'user-1',
            fullName: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
          },
        };
        return newReview;
      }

      const response = await apiClient.post<Review>(`/restaurants/${restaurantId}/reviews`, review);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to submit review');
    }
  }

  async getNearbyRestaurants(
    coordinates: { latitude: number; longitude: number },
    radius: number = 5
  ): Promise<Restaurant[]> {
    try {
      if (__DEV__) {
        await this.delay(500);
        // Mock nearby restaurants based on coordinates
        return mockDataService.getRestaurants().filter(() => Math.random() > 0.5);
      }

      const response = await apiClient.get<Restaurant[]>('/restaurants/nearby', {
        params: { latitude: coordinates.latitude, longitude: coordinates.longitude, radius },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch nearby restaurants');
    }
  }
}

export const restaurantService = new RestaurantService();
export default restaurantService;