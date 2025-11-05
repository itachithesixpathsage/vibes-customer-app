// Generic API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
  stack?: string;
}

export interface ApiListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchRequest extends PaginatedRequest {
  query?: string;
  filters?: Record<string, any>;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  auth?: {
    tokenGetter: () => string | null;
    tokenRefreshFn?: () => Promise<string | null>;
  };
  logging?: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
}

// Network status
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  details?: any;
}

// WebSocket configuration
export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  heartbeatTimeout: number;
}

// WebSocket message types
export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
  id?: string;
}

// File upload types
export interface FileUploadRequest {
  file: {
    uri: string;
    type: string;
    name: string;
    size?: number;
  };
  field: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Rate limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Caching
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  etag?: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}

// Error handling
export interface ErrorBoundaryInfo {
  error: Error;
  errorInfo: any;
  componentStack: string;
  timestamp: string;
}

// Performance metrics
export interface ApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  slowestRequests: Array<{
    url: string;
    method: string;
    duration: number;
    timestamp: string;
  }>;
  errorRate: number;
  uptime: number;
}

// Health check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    [serviceName: string]: {
      status: 'up' | 'down';
      responseTime?: number;
      lastChecked: string;
    };
  };
}

// Export all types
export * from './auth';
export * from './restaurant';
export * from './order';
export * from './cart';
export * from './location';
export * from './navigation';