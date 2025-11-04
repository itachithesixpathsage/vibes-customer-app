import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ApiClientConfig, ApiResponse } from '@types/api';

class ApiClient {
  private instance: AxiosInstance;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.config.auth?.tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        if (this.config.logging?.enabled) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.instance.interceptors.response.use(
      (response) => {
        const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();

        if (this.config.logging?.enabled) {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (this.config.logging?.enabled) {
          console.error(
            `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
            error.response?.data || error.message
          );
        }

        // Handle 401 Unauthorized - token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.config.auth?.tokenRefreshFn?.();
            if (newToken) {
              originalRequest.headers!.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Handle logout or redirect to login
            await AsyncStorage.removeItem('authToken');
            window.location?.reload(); // For web
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiResponse {
    const response = error.response;

    if (response) {
      // Server responded with error status
      return {
        success: false,
        error: {
          code: response.data?.code || 'SERVER_ERROR',
          message: response.data?.message || 'Server error occurred',
          details: response.data?.details,
          field: response.data?.field,
        },
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      // Other error
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // File upload
  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Download
  async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    try {
      const response = await this.instance.get(url, {
        ...config,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cancel request
  createCancelToken() {
    return axios.CancelToken.source();
  }

  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }
}

// Create API client instance
const apiClientConfig: ApiClientConfig = {
  baseURL: process.env.NODE_ENV === 'development'
    ? 'https://api-dev.perseus.com/v1'
    : 'https://api.perseus.com/v1',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Accept': 'application/json',
    'Client-Version': '1.0.0',
    'Client-Platform': 'mobile',
  },
  auth: {
    tokenGetter: async () => {
      try {
        return await AsyncStorage.getItem('authToken');
      } catch {
        return null;
      }
    },
    tokenRefreshFn: async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) return null;

        const response = await axios.post(`${apiClientConfig.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        return token;
      } catch {
        return null;
      }
    },
  },
  logging: {
    enabled: __DEV__,
    logLevel: 'info',
  },
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 100,
  },
};

export const apiClient = new ApiClient(apiClientConfig);
export default apiClient;