import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Location, Address, Coordinates, LocationPermission, DeliveryZone } from '@types/location';
import { locationService } from '@services/locationService';

interface LocationState {
  currentLocation: Location | null;
  currentAddress: Address | null;
  savedAddresses: Address[];
  selectedAddress: Address | null;
  permission: LocationPermission;
  isLoading: boolean;
  isAddressLoading: boolean;
  error: string | null;
  deliveryZones: DeliveryZone[];
  isLocationEnabled: boolean;
  isWatchingLocation: boolean;
  lastLocationUpdate: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  currentAddress: null,
  savedAddresses: [],
  selectedAddress: null,
  permission: {
    granted: false,
    canAskAgain: true,
    status: 'unavailable',
  },
  isLoading: false,
  isAddressLoading: false,
  error: null,
  deliveryZones: [],
  isLocationEnabled: false,
  isWatchingLocation: false,
  lastLocationUpdate: null,
};

// Async thunks
export const requestLocationPermission = createAsyncThunk(
  'location/requestPermission',
  async (_, { rejectWithValue }) => {
    try {
      const permission = await locationService.requestLocationPermission();
      return permission;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to request location permission');
    }
  }
);

export const getCurrentLocation = createAsyncThunk(
  'location/getCurrentLocation',
  async (options?: { timeout?: number }, { rejectWithValue }) => {
    try {
      const location = await locationService.getCurrentLocation(options);
      return location;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get current location');
    }
  }
);

export const startLocationWatching = createAsyncThunk(
  'location/startLocationWatching',
  async (options?: { interval?: number; distanceFilter?: number }, { rejectWithValue }) => {
    try {
      await locationService.startLocationWatching(options);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start location watching');
    }
  }
);

export const stopLocationWatching = createAsyncThunk(
  'location/stopLocationWatching',
  async (_, { rejectWithValue }) => {
    try {
      await locationService.stopLocationWatching();
      return false;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to stop location watching');
    }
  }
);

export const geocodeAddress = createAsyncThunk(
  'location/geocodeAddress',
  async (address: string, { rejectWithValue }) => {
    try {
      const result = await locationService.geocodeAddress(address);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to geocode address');
    }
  }
);

export const reverseGeocode = createAsyncThunk(
  'location/reverseGeocode',
  async (coordinates: Coordinates, { rejectWithValue }) => {
    try {
      const address = await locationService.reverseGeocode(coordinates);
      return { coordinates, address };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reverse geocode coordinates');
    }
  }
);

export const searchAddresses = createAsyncThunk(
  'location/searchAddresses',
  async (query: string, { rejectWithValue }) => {
    try {
      const results = await locationService.searchAddresses(query);
      return results;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search addresses');
    }
  }
);

export const fetchSavedAddresses = createAsyncThunk(
  'location/fetchSavedAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const addresses = await locationService.getSavedAddresses();
      return addresses;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch saved addresses');
    }
  }
);

export const addAddress = createAsyncThunk(
  'location/addAddress',
  async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const address = await locationService.addAddress(addressData);
      return address;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'location/updateAddress',
  async (params: { addressId: string; updates: Partial<Address> }, { rejectWithValue }) => {
    try {
      const address = await locationService.updateAddress(params.addressId, params.updates);
      return address;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'location/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await locationService.deleteAddress(addressId);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'location/setDefaultAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await locationService.setDefaultAddress(addressId);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to set default address');
    }
  }
);

export const validateAddress = createAsyncThunk(
  'location/validateAddress',
  async (address: Partial<Address>, { rejectWithValue }) => {
    try {
      const validation = await locationService.validateAddress(address);
      return validation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to validate address');
    }
  }
);

export const fetchDeliveryZones = createAsyncThunk(
  'location/fetchDeliveryZones',
  async (params: { restaurantId: string; coordinates?: Coordinates }, { rejectWithValue }) => {
    try {
      const zones = await locationService.getDeliveryZones(params.restaurantId, params.coordinates);
      return zones;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch delivery zones');
    }
  }
);

// Slice
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<Address | null>) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
    updateCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.lastLocationUpdate = new Date().toISOString();
      state.isLocationEnabled = true;
    },
    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isLocationEnabled = action.payload;
    },
    setPermission: (state, action: PayloadAction<LocationPermission>) => {
      state.permission = action.payload;
    },
    clearSavedAddresses: (state) => {
      state.savedAddresses = [];
    },
    // Real-time location updates (from location watching)
    locationUpdate: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.lastLocationUpdate = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Request Location Permission
    builder
      .addCase(requestLocationPermission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestLocationPermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permission = action.payload;
        state.error = null;
      })
      .addCase(requestLocationPermission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.permission = {
          granted: false,
          canAskAgain: false,
          status: 'denied',
        };
      });

    // Get Current Location
    builder
      .addCase(getCurrentLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload;
        state.lastLocationUpdate = new Date().toISOString();
        state.isLocationEnabled = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isLocationEnabled = false;
      });

    // Start Location Watching
    builder
      .addCase(startLocationWatching.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startLocationWatching.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isWatchingLocation = action.payload;
        state.error = null;
      })
      .addCase(startLocationWatching.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isWatchingLocation = false;
      });

    // Stop Location Watching
    builder
      .addCase(stopLocationWatching.fulfilled, (state, action) => {
        state.isWatchingLocation = action.payload;
      });

    // Geocode Address
    builder
      .addCase(geocodeAddress.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(geocodeAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        // Update current address if coordinates match
        if (state.currentLocation &&
            Math.abs(state.currentLocation.latitude - action.payload.coordinates.latitude) < 0.0001 &&
            Math.abs(state.currentLocation.longitude - action.payload.coordinates.longitude) < 0.0001) {
          state.currentAddress = action.payload.address;
        }
        state.error = null;
      })
      .addCase(geocodeAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Reverse Geocode
    builder
      .addCase(reverseGeocode.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(reverseGeocode.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.currentAddress = action.payload.address;
        state.error = null;
      })
      .addCase(reverseGeocode.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Search Addresses
    builder
      .addCase(searchAddresses.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(searchAddresses.fulfilled, (state) => {
        state.isAddressLoading = false;
        state.error = null;
      })
      .addCase(searchAddresses.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Saved Addresses
    builder
      .addCase(fetchSavedAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedAddresses = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add Address
    builder
      .addCase(addAddress.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.savedAddresses.push(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Update Address
    builder
      .addCase(updateAddress.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        const index = state.savedAddresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.savedAddresses[index] = action.payload;
        }
        if (state.selectedAddress && state.selectedAddress.id === action.payload.id) {
          state.selectedAddress = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Delete Address
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.savedAddresses = state.savedAddresses.filter(addr => addr.id !== action.payload);
        if (state.selectedAddress && state.selectedAddress.id === action.payload) {
          state.selectedAddress = null;
        }
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Set Default Address
    builder
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // Reset all addresses to non-default
        state.savedAddresses.forEach(addr => {
          addr.isDefault = false;
        });

        // Set new default
        const defaultAddress = state.savedAddresses.find(addr => addr.id === action.payload);
        if (defaultAddress) {
          defaultAddress.isDefault = true;
          state.selectedAddress = defaultAddress;
        }
      });

    // Validate Address
    builder
      .addCase(validateAddress.pending, (state) => {
        state.isAddressLoading = true;
        state.error = null;
      })
      .addCase(validateAddress.fulfilled, (state) => {
        state.isAddressLoading = false;
        state.error = null;
      })
      .addCase(validateAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Delivery Zones
    builder
      .addCase(fetchDeliveryZones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryZones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryZones = action.payload;
        state.error = null;
      })
      .addCase(fetchDeliveryZones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setLoading,
  setSelectedAddress,
  clearSelectedAddress,
  updateCurrentLocation,
  setLocationEnabled,
  setPermission,
  clearSavedAddresses,
  locationUpdate,
} = locationSlice.actions;

// Selectors
export const selectCurrentLocation = (state: { location: LocationState }) => state.location.currentLocation;
export const selectCurrentAddress = (state: { location: LocationState }) => state.location.currentAddress;
export const selectSavedAddresses = (state: { location: LocationState }) => state.location.savedAddresses;
export const selectSelectedAddress = (state: { location: LocationState }) => state.location.selectedAddress;
export const selectLocationPermission = (state: { location: LocationState }) => state.location.permission;
export const selectLocationLoading = (state: { location: LocationState }) => state.location.isLoading;
export const selectAddressLoading = (state: { location: LocationState }) => state.location.isAddressLoading;
export const selectLocationError = (state: { location: LocationState }) => state.location.error;
export const selectIsLocationEnabled = (state: { location: LocationState }) => state.location.isLocationEnabled;
export const selectIsWatchingLocation = (state: { location: LocationState }) => state.location.isWatchingLocation;
export const selectDefaultAddress = (state: { location: LocationState }) =>
  state.location.savedAddresses.find(addr => addr.isDefault);
export const selectCanDeliverToAddress = (addressId: string) => (state: { location: LocationState }) => {
  const address = state.location.savedAddresses.find(addr => addr.id === addressId);
  return address?.isDeliveryAvailable || false;
};
export const selectDeliveryZones = (state: { location: LocationState }) => state.location.deliveryZones;

export default locationSlice.reducer;