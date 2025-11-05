export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  type: AddressType;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  isDefault: boolean;
  isDeliveryAvailable: boolean;
  deliveryRadius: number;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'unavailable';
}

export interface GeolocationInfo {
  location: Location;
  address: GeocodedAddress;
  accuracy: number;
  timestamp: number;
}

export interface GeocodedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  formattedAddress: string;
}

export interface DeliveryZone {
  id: string;
  restaurantId: string;
  center: Coordinates;
  radius: number;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDeliveryTime: {
    min: number;
    max: number;
  };
  isActive: boolean;
  polygon?: Coordinates[]; // For non-circular delivery zones
}

export interface LocationSearchResult {
  placeId: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  types: string[];
  distance?: number;
  rating?: number;
}

export interface LocationSearchRequest {
  query: string;
  location?: Coordinates;
  radius?: number;
  types?: string[];
  limit?: number;
}

export interface LocationSearchResponse {
  results: LocationSearchResult[];
  total: number;
  hasMore: boolean;
}

export interface ReverseGeocodingRequest {
  coordinates: Coordinates;
  language?: string;
}

export interface ReverseGeocodingResponse {
  address: GeocodedAddress;
  confidence: number;
  types: string[];
}

export interface AddressValidation {
  isValid: boolean;
  isDeliverable: boolean;
  normalizedAddress?: Address;
  errors: AddressValidationError[];
  suggestions?: GeocodedAddress[];
}

export interface AddressValidationError {
  type: 'invalid-format' | 'not-found' | 'incomplete' | 'outside-delivery-area';
  message: string;
  field?: string;
  suggestion?: string;
}

export interface LocationState {
  currentLocation: Location | null;
  currentAddress: Address | null;
  savedAddresses: Address[];
  permission: LocationPermission;
  isLoading: boolean;
  error: string | null;
  deliveryZones: DeliveryZone[];
  selectedAddress: Address | null;
  isLocationEnabled: boolean;
}

// Enums
export type AddressType = 'home' | 'work' | 'other' | 'hotel' | 'apartment' | 'house';

// API Request/Response types
export interface AddAddressRequest {
  label: string;
  type: AddressType;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  instructions?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<AddAddressRequest> {
  id: string;
}

export interface AddressResponse extends Address {}

export interface AddressListResponse {
  addresses: Address[];
  total: number;
  defaultAddressId?: string;
}

export interface SetDefaultAddressRequest {
  addressId: string;
}

export interface DeleteAddressRequest {
  addressId: string;
}

export interface ValidateAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Coordinates;
}

export interface ValidateAddressResponse extends AddressValidation {}

export interface GetDeliveryZonesRequest {
  restaurantId: string;
  coordinates: Coordinates;
}

export interface GetDeliveryZonesResponse {
  zones: DeliveryZone[];
  isDeliverable: boolean;
  nearestZone?: DeliveryZone;
}