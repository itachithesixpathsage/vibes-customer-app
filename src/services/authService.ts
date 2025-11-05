import { apiClient } from './apiClient';
import { mockDataService } from './mockDataService';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  SocialLoginData,
  UpdateProfileData,
  ForgotPasswordData,
  ResetPasswordData,
} from '@types/auth';

class AuthService {
  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In development, use mock data
      if (__DEV__) {
        await this.delay(800);

        const users = mockDataService.getUsers();
        const user = users.find(
          u => u.email === credentials.email
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        return {
          user,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600,
        };
      }

      // Production API call
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      if (__DEV__) {
        await this.delay(1000);

        // Check if user already exists
        const users = mockDataService.getUsers();
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Create new user (mock)
        const newUser = {
          id: 'user-' + Date.now(),
          email: userData.email,
          fullName: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailVerified: false,
          phoneVerified: false,
          marketingConsent: userData.marketingConsent || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
        };

        return {
          user: newUser,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600,
        };
      }

      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async socialLogin(data: SocialLoginData): Promise<AuthResponse> {
    try {
      if (__DEV__) {
        await this.delay(600);

        // Mock social login
        const user = {
          id: 'user-social-' + Date.now(),
          email: data.email || `user-${data.provider}@example.com`,
          fullName: data.fullName || 'Social User',
          firstName: data.fullName?.split(' ')[0] || 'Social',
          lastName: data.fullName?.split(' ')[1] || 'User',
          emailVerified: true,
          phoneVerified: false,
          marketingConsent: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
        };

        return {
          user,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600,
        };
      }

      const response = await apiClient.post<AuthResponse>(`/auth/social/${data.provider}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Social login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      if (__DEV__) {
        await this.delay(300);
        return;
      }

      await apiClient.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Don't throw error for logout - always succeed locally
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      if (__DEV__) {
        await this.delay(400);
        return {
          token: 'mock-jwt-token-refreshed-' + Date.now(),
          refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
        };
      }

      const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    try {
      if (__DEV__) {
        await this.delay(300);

        // Return first user for mock
        const users = mockDataService.getUsers();
        if (users.length > 0) {
          return {
            user: users[0],
            token: 'mock-jwt-token-current-' + Date.now(),
            refreshToken: 'mock-refresh-token-current-' + Date.now(),
            expiresIn: 3600,
          };
        }
        return null;
      }

      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error: any) {
      // Return null for 401 (not authenticated)
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error(error.message || 'Failed to get current user');
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<{ user: any; message: string }> {
    try {
      if (__DEV__) {
        await this.delay(600);

        const users = mockDataService.getUsers();
        const user = users.find(u => u.email === 'john.doe@example.com'); // Mock current user

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser = { ...user, ...profileData, updatedAt: new Date().toISOString() };

        return {
          user: updatedUser,
          message: 'Profile updated successfully',
        };
      }

      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (__DEV__) {
        await this.delay(500);
        return {
          success: true,
          message: 'Password reset email sent successfully',
        };
      }

      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (__DEV__) {
        await this.delay(600);
        return {
          success: true,
          message: 'Password reset successful',
        };
      }

      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      if (__DEV__) {
        await this.delay(400);
        return {
          success: true,
          message: 'Email verified successfully',
        };
      }

      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Email verification failed');
    }
  }

  async resendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    try {
      if (__DEV__) {
        await this.delay(300);
        return {
          success: true,
          message: 'Verification email sent successfully',
        };
      }

      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-verification');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend verification email');
    }
  }
}

export const authService = new AuthService();
export default authService;