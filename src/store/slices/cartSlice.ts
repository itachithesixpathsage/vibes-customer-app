import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, PromoCode, AddToCartRequest, UpdateCartItemRequest } from '@types/cart';
import { cartService } from '@services/cartService';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  tip: number;
  total: number;
  promoCode: PromoCode | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CartState = {
  cart: null,
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  serviceFee: 0,
  taxes: 0,
  discount: 0,
  tip: 0,
  total: 0,
  promoCode: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (request: AddToCartRequest, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { cart: CartState };
      const currentRestaurantId = state.cart?.restaurantId;

      // If adding from a different restaurant, clear cart first
      if (currentRestaurantId && request.menuItemId !== currentRestaurantId) {
        await cartService.clearCart();
      }

      const response = await cartService.addToCart(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (request: { itemId: string; data: UpdateCartItemRequest }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(request.itemId, request.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

export const applyPromoCode = createAsyncThunk(
  'cart/applyPromoCode',
  async (code: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { cart: CartState };
      if (!state.cart?.restaurantId) {
        throw new Error('No restaurant in cart');
      }

      const response = await cartService.applyPromoCode(code, state.cart.restaurantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply promo code');
    }
  }
);

export const removePromoCode = createAsyncThunk(
  'cart/removePromoCode',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.removePromoCode();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove promo code');
    }
  }
);

export const updateTip = createAsyncThunk(
  'cart/updateTip',
  async (tip: number, { rejectWithValue }) => {
    try {
      const response = await cartService.updateTip(tip);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update tip');
    }
  }
);

export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.validateCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Cart validation failed');
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        calculateTotals(state);
      }
    },
    setTip: (state, action: PayloadAction<number>) => {
      state.tip = action.payload;
      calculateTotals(state);
    },
    // Local optimistic updates
    optimisticAddToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      calculateTotals(state);
    },
    optimisticRemoveFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
    },
    optimisticUpdateItem: (state, action: PayloadAction<{ itemId: string; updates: Partial<CartItem> }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId);
      if (item) {
        Object.assign(item, action.payload.updates);
        calculateTotals(state);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, () => {
        return initialState;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Apply Promo Code
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promoCode = action.payload.promoCode;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove Promo Code
    builder
      .addCase(removePromoCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removePromoCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promoCode = null;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removePromoCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Tip
    builder
      .addCase(updateTip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTip.fulfilled, (state, action) => {
        state.isLoading = false;
        updateCartFromResponse(state, action.payload);
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateTip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Validate Cart
    builder
      .addCase(validateCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Validation might return updated pricing
        if (action.payload.items) {
          updateCartFromResponse(state, action.payload);
        }
        state.error = null;
      })
      .addCase(validateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Helper function to update cart state from API response
function updateCartFromResponse(state: CartState, response: Partial<Cart>) {
  state.subtotal = response.subtotal || 0;
  state.deliveryFee = response.deliveryFee || 0;
  state.serviceFee = response.serviceFee || 0;
  state.taxes = response.taxes || 0;
  state.discount = response.discount || 0;
  state.tip = response.tip || 0;
  state.total = response.total || 0;
}

// Helper function to calculate totals locally
function calculateTotals(state: CartState) {
  state.subtotal = state.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  // Calculate other totals (these would normally come from API)
  state.deliveryFee = state.cart?.deliveryFee || 0;
  state.serviceFee = state.cart?.serviceFee || (state.subtotal > 0 ? 2.99 : 0);
  state.taxes = state.subtotal * 0.08; // 8% tax rate
  state.discount = state.promoCode ? calculateDiscount(state.subtotal, state.promoCode) : 0;
  state.total = state.subtotal + state.deliveryFee + state.serviceFee + state.taxes + state.tip - state.discount;
}

function calculateDiscount(subtotal: number, promoCode: PromoCode): number {
  if (promoCode.type === 'percentage') {
    return Math.min(subtotal * (promoCode.value / 100), promoCode.maxDiscountAmount || Infinity);
  } else if (promoCode.type === 'fixed') {
    return Math.min(promoCode.value, subtotal);
  } else if (promoCode.type === 'free-delivery') {
    return 0; // Delivery fee handled separately
  }
  return 0;
}

export const {
  clearError,
  setLoading,
  updateQuantity,
  setTip,
  optimisticAddToCart,
  optimisticRemoveFromCart,
  optimisticUpdateItem,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.subtotal;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectPromoCode = (state: { cart: CartState }) => state.cart.promoCode;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectIsEmptyCart = (state: { cart: CartState }) => state.cart.items.length === 0;
export const selectCanCheckout = (state: { cart: CartState }) =>
  state.cart.items.length > 0 && state.cart.total > 0;

export default cartSlice.reducer;