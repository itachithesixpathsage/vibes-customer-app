// Export all services
export { default as apiClient } from './apiClient';
export { default as mockDataService } from './mockDataService';
export { default as authService } from './authService';
export { default as restaurantService } from './restaurantService';
export { default as cartService } from './cartService';
export { default as orderService } from './orderService';
export { default as locationService } from './locationService';

// WebSocket service (placeholder for real-time features)
export const websocketService = {
  connect: () => {
    console.log('WebSocket connection placeholder');
  },
  disconnect: () => {
    console.log('WebSocket disconnect placeholder');
  },
  subscribe: (event: string, callback: (data: any) => void) => {
    console.log(`WebSocket subscribe placeholder: ${event}`);
  },
  unsubscribe: (event: string) => {
    console.log(`WebSocket unsubscribe placeholder: ${event}`);
  },
};

// Notification service (placeholder)
export const notificationService = {
  requestPermission: async () => {
    return { granted: true };
  },
  sendLocalNotification: (title: string, body: string) => {
    console.log(`Local notification: ${title} - ${body}`);
  },
  scheduleNotification: (title: string, body: string, date: Date) => {
    console.log(`Scheduled notification: ${title} - ${body} at ${date}`);
  },
};