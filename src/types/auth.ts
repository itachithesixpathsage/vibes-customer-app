export interface User {
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

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    halal: boolean;
    kosher: boolean;
  };
  language: string;
  currency: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingConsent?: boolean;
  termsAccepted: boolean;
}

export interface SocialLoginData {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
  email?: string;
  fullName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  preferences?: Partial<UserPreferences>;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// API Request/Response types
export interface LoginRequest extends LoginCredentials {}
export interface RegisterRequest extends RegisterData {}
export interface ForgotPasswordRequest extends ForgotPasswordData {}
export interface ResetPasswordRequest extends ResetPasswordData {}
export interface UpdateProfileRequest extends UpdateProfileData {}

export interface LoginResponse extends AuthResponse {}
export interface RegisterResponse extends AuthResponse {}
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}