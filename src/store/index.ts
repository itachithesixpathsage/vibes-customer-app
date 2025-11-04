import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import restaurantSlice from './slices/restaurantSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import locationSlice from './slices/locationSlice';
import userSlice from './slices/userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'user', 'location'], // Persist these slices
  blacklist: ['restaurant', 'order'], // Don't persist these slices
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  restaurant: restaurantSlice,
  cart: cartSlice,
  order: orderSlice,
  user: userSlice,
  location: locationSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
  devTools: __DEV__,
});

// Persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectRestaurant = (state: RootState) => state.restaurant;
export const selectCart = (state: RootState) => state.cart;
export const selectOrder = (state: RootState) => state.order;
export const selectLocation = (state: RootState) => state.location;

// Common selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCurrentLocation = (state: RootState) => state.location.currentLocation;

export default store;