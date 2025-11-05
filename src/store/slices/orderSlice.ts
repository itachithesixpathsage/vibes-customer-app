import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus, CreateOrderRequest, OrderSearchFilters, OrderListResponse } from '@types/order';
import { orderService } from '@services/orderService';

interface OrderState {
  activeOrders: Order[];
  orderHistory: Order[];
  currentOrder: Order | null;
  trackingInfo: any;
  isLoading: boolean;
  isHistoryLoading: boolean;
  isTrackingLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: OrderState = {
  activeOrders: [],
  orderHistory: [],
  currentOrder: null,
  trackingInfo: null,
  isLoading: false,
  isHistoryLoading: false,
  isTrackingLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
};

// Async thunks
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.placeOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (params: { page?: number; limit?: number; filters?: OrderSearchFilters }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderHistory(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order history');
    }
  }
);

export const fetchActiveOrders = createAsyncThunk(
  'order/fetchActiveOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getActiveOrders();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const trackOrder = createAsyncThunk(
  'order/trackOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.trackOrder(orderId);
      return { orderId, trackingInfo: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to track order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (params: { orderId: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(params.orderId, params.reason);
      return { orderId: params.orderId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

export const reorderItems = createAsyncThunk(
  'order/reorderItems',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.reorderItems(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reorder items');
    }
  }
);

export const rateOrder = createAsyncThunk(
  'order/rateOrder',
  async (params: { orderId: string; rating: any }, { rejectWithValue }) => {
    try {
      const response = await orderService.rateOrder(params.orderId, params.rating);
      return { orderId: params.orderId, rating: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to rate order');
    }
  }
);

// Real-time order updates (from WebSocket)
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async (update: { orderId: string; status: OrderStatus; timestamp: string; note?: string }, { rejectWithValue }) => {
    try {
      // This might be called from WebSocket updates
      return update;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const updateDriverLocation = createAsyncThunk(
  'order/updateDriverLocation',
  async (update: { orderId: string; location: any; timestamp: string }, { rejectWithValue }) => {
    try {
      return update;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update driver location');
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.trackingInfo = null;
    },
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const updateOrderInArray = (orders: Order[]) => {
        const index = orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          orders[index] = action.payload;
        }
        return orders;
      };

      state.activeOrders = updateOrderInArray(state.activeOrders);
      state.orderHistory = updateOrderInArray(state.orderHistory);

      if (state.currentOrder && state.currentOrder.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    },
    // WebSocket real-time updates
    realtimeOrderUpdate: (state, action: PayloadAction<{ orderId: string; update: Partial<Order> }>) => {
      const { orderId, update } = action.payload;

      const updateOrder = (order: Order) => {
        if (order.id === orderId) {
          return { ...order, ...update };
        }
        return order;
      };

      state.activeOrders = state.activeOrders.map(updateOrder);
      state.orderHistory = state.orderHistory.map(updateOrder);

      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder = { ...state.currentOrder, ...update };
      }
    },
    realtimeTrackingUpdate: (state, action: PayloadAction<{ orderId: string; trackingInfo: any }>) => {
      const { orderId, trackingInfo } = action.payload;

      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.trackingInfo = trackingInfo;
      }

      // Update tracking info for active orders
      const updateActiveOrder = (order: Order) => {
        if (order.id === orderId) {
          return { ...order, tracking: trackingInfo };
        }
        return order;
      };

      state.activeOrders = state.activeOrders.map(updateActiveOrder);
    },
  },
  extraReducers: (builder) => {
    // Place Order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.activeOrders.push(action.payload);
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Order History
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isHistoryLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        if (action.meta.arg.page === 1) {
          // New fetch
          state.orderHistory = action.payload.orders;
        } else {
          // Append for pagination
          state.orderHistory = [...state.orderHistory, ...action.payload.orders];
        }
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Active Orders
    builder
      .addCase(fetchActiveOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Track Order
    builder
      .addCase(trackOrder.pending, (state) => {
        state.isTrackingLoading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.isTrackingLoading = false;
        if (state.currentOrder && state.currentOrder.id === action.payload.orderId) {
          state.trackingInfo = action.payload.trackingInfo;
        }
        state.error = null;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.isTrackingLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId } = action.payload;

        // Move order from active to history
        const cancelledOrderIndex = state.activeOrders.findIndex(order => order.id === orderId);
        if (cancelledOrderIndex !== -1) {
          const cancelledOrder = state.activeOrders[cancelledOrderIndex];
          cancelledOrder.status = 'cancelled';
          state.orderHistory.unshift(cancelledOrder);
          state.activeOrders.splice(cancelledOrderIndex, 1);
        }

        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder.status = 'cancelled';
        }

        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reorder Items
    builder
      .addCase(reorderItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reorderItems.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Reorder will typically add items to cart, handled by cart slice
      })
      .addCase(reorderItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Rate Order
    builder
      .addCase(rateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, rating } = action.payload;

        // Update order rating in lists
        const updateOrderRating = (order: Order) => {
          if (order.id === orderId) {
            return { ...order, rating: rating };
          }
          return order;
        };

        state.orderHistory = state.orderHistory.map(updateOrderRating);

        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder = { ...state.currentOrder, rating: rating };
        }

        state.error = null;
      })
      .addCase(rateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Order Status (for WebSocket updates)
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status, timestamp, note } = action.payload;

        const updateOrderStatus = (order: Order) => {
          if (order.id === orderId) {
            const updatedOrder = { ...order, status };
            // Add to timeline
            if (!updatedOrder.timeline) {
              updatedOrder.timeline = [];
            }
            updatedOrder.timeline.push({
              id: `${orderId}-${timestamp}`,
              status,
              timestamp,
              note,
              isCompleted: true,
            });
            updatedOrder.updatedAt = timestamp;
            return updatedOrder;
          }
          return order;
        };

        state.activeOrders = state.activeOrders.map(updateOrderStatus);

        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder = updateOrderStatus(state.currentOrder);
        }
      });

    // Update Driver Location (for WebSocket updates)
    builder
      .addCase(updateDriverLocation.fulfilled, (state, action) => {
        const { orderId, location } = action.payload;

        if (state.currentOrder && state.currentOrder.id === orderId && state.currentOrder.tracking) {
          state.currentOrder.tracking.driverLocation = location;
        }
      });
  },
});

export const {
  clearError,
  setLoading,
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderInList,
  realtimeOrderUpdate,
  realtimeTrackingUpdate,
} = orderSlice.actions;

// Selectors
export const selectActiveOrders = (state: { order: OrderState }) => state.order.activeOrders;
export const selectOrderHistory = (state: { order: OrderState }) => state.order.orderHistory;
export const selectCurrentOrder = (state: { order: OrderState }) => state.order.currentOrder;
export const selectTrackingInfo = (state: { order: OrderState }) => state.order.trackingInfo;
export const selectOrderLoading = (state: { order: OrderState }) => state.order.isLoading;
export const selectHistoryLoading = (state: { order: OrderState }) => state.order.isHistoryLoading;
export const selectTrackingLoading = (state: { order: OrderState }) => state.order.isTrackingLoading;
export const selectOrderError = (state: { order: OrderState }) => state.order.error;
export const selectOrderById = (orderId: string) => (state: { order: OrderState }) =>
  state.order.activeOrders.find(order => order.id === orderId) ||
  state.order.orderHistory.find(order => order.id === orderId);
export const selectHasActiveOrders = (state: { order: OrderState }) => state.order.activeOrders.length > 0;

export default orderSlice.reducer;