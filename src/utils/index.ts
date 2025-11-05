// Utility functions
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString();
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

// Storage utilities
export const storage = {
  set: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      // In production, use AsyncStorage
      console.log(`Storage set: ${key}`, jsonValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  get: async (key: string): Promise<any> => {
    try {
      // In production, use AsyncStorage
      console.log(`Storage get: ${key}`);
      return null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      // In production, use AsyncStorage
      console.log(`Storage remove: ${key}`);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      // In production, use AsyncStorage
      console.log('Storage clear');
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};