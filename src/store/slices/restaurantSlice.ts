import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant, Category, MenuItem, Review, RestaurantSearchFilters } from '@types/restaurant';
import { restaurantService } from '@services/restaurantService';

interface RestaurantState {
  restaurants: Restaurant[];
  featured: Restaurant[];
  trending: Restaurant[];
  categories: Category[];
  currentRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  reviews: Review[];
  searchResults: Restaurant[];
  searchFilters: RestaurantSearchFilters;
  favorites: string[]; // Array of restaurant IDs
  isLoading: boolean;
  isMenuLoading: boolean;
  isReviewsLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: RestaurantState = {
  restaurants: [],
  featured: [],
  trending: [],
  categories: [],
  currentRestaurant: null,
  menuItems: [],
  reviews: [],
  searchResults: [],
  searchFilters: {},
  favorites: [],
  isLoading: false,
  isMenuLoading: false,
  isReviewsLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
};

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (params: { page?: number; limit?: number; filters?: RestaurantSearchFilters }, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurants(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurantById(restaurantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurant');
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurant/searchRestaurants',
  async (params: RestaurantSearchFilters, { rejectWithValue }) => {
    try {
      const response = await restaurantService.searchRestaurants(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'restaurant/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'restaurant/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getFeatured();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured restaurants');
    }
  }
);

export const fetchTrending = createAsyncThunk(
  'restaurant/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getTrending();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trending restaurants');
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  'restaurant/fetchMenuItems',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getMenuItems(restaurantId);
      return { restaurantId, items: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'restaurant/fetchReviews',
  async (params: { restaurantId: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getReviews(params.restaurantId, params.page);
      return { restaurantId: params.restaurantId, reviews: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'restaurant/toggleFavorite',
  async (restaurantId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { restaurant: RestaurantState };
      const isFavorite = state.restaurant.favorites.includes(restaurantId);

      if (isFavorite) {
        await restaurantService.removeFromFavorites(restaurantId);
      } else {
        await restaurantService.addToFavorites(restaurantId);
      }

      return { restaurantId, isFavorite: !isFavorite };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update favorite status');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'restaurant/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getFavorites();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch favorites');
    }
  }
);

// Slice
const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<RestaurantSearchFilters>) => {
      state.searchFilters = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
      state.menuItems = [];
      state.reviews = [];
    },
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchFilters.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Restaurants
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1) {
          // New search
          state.restaurants = action.payload.restaurants;
        } else {
          // Append for pagination
          state.restaurants = [...state.restaurants, ...action.payload.restaurants];
        }
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Restaurant by ID
    builder
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Restaurants
    builder
      .addCase(searchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.restaurants;
        state.searchFilters = action.payload.filters || {};
        state.error = null;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Featured
    builder
      .addCase(fetchFeatured.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featured = action.payload;
        state.error = null;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Trending
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trending = action.payload;
        state.error = null;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Menu Items
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isMenuLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isMenuLoading = false;
        state.menuItems = action.payload.items;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isMenuLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Reviews
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isReviewsLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isReviewsLoading = false;
        if (action.meta.arg.page === 1) {
          // New reviews fetch
          state.reviews = action.payload.reviews;
        } else {
          // Append for pagination
          state.reviews = [...state.reviews, ...action.payload.reviews];
        }
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isReviewsLoading = false;
        state.error = action.payload as string;
      });

    // Toggle Favorite
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { restaurantId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(restaurantId);
        } else {
          state.favorites = state.favorites.filter(id => id !== restaurantId);
        }

        // Update restaurant in lists
        const updateRestaurantFavorite = (restaurant: Restaurant) => {
          if (restaurant.id === restaurantId) {
            return { ...restaurant, isFavorite };
          }
          return restaurant;
        };

        state.restaurants = state.restaurants.map(updateRestaurantFavorite);
        state.featured = state.featured.map(updateRestaurantFavorite);
        state.trending = state.trending.map(updateRestaurantFavorite);
        state.searchResults = state.searchResults.map(updateRestaurantFavorite);

        if (state.currentRestaurant && state.currentRestaurant.id === restaurantId) {
          state.currentRestaurant = { ...state.currentRestaurant, isFavorite };
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setLoading,
  setSearchFilters,
  clearSearchResults,
  clearCurrentRestaurant,
  updateSearchQuery,
} = restaurantSlice.actions;

// Selectors
export const selectRestaurants = (state: { restaurant: RestaurantState }) => state.restaurant.restaurants;
export const selectFeatured = (state: { restaurant: RestaurantState }) => state.restaurant.featured;
export const selectTrending = (state: { restaurant: RestaurantState }) => state.restaurant.trending;
export const selectCategories = (state: { restaurant: RestaurantState }) => state.restaurant.categories;
export const selectCurrentRestaurant = (state: { restaurant: RestaurantState }) => state.restaurant.currentRestaurant;
export const selectMenuItems = (state: { restaurant: RestaurantState }) => state.restaurant.menuItems;
export const selectReviews = (state: { restaurant: RestaurantState }) => state.restaurant.reviews;
export const selectSearchResults = (state: { restaurant: RestaurantState }) => state.restaurant.searchResults;
export const selectSearchFilters = (state: { restaurant: RestaurantState }) => state.restaurant.searchFilters;
export const selectFavorites = (state: { restaurant: RestaurantState }) => state.restaurant.favorites;
export const selectIsFavorite = (restaurantId: string) => (state: { restaurant: RestaurantState }) =>
  state.restaurant.favorites.includes(restaurantId);
export const selectRestaurantLoading = (state: { restaurant: RestaurantState }) => state.restaurant.isLoading;
export const selectRestaurantError = (state: { restaurant: RestaurantState }) => state.restaurant.error;

export default restaurantSlice.reducer;