# Project Perseus - Customer Frontend

A premium, futuristic multi-vendor food delivery mobile app built with React Native.

## Features

- **Premium Design**: High-tech culinary galaxy interface with sophisticated gradients and smooth animations
- **Multi-vendor Support**: Browse and order from multiple restaurants
- **Real-time Order Tracking**: Live delivery tracking with map visualization
- **Smart Search & Filters**: Advanced search with multiple filter options
- **Favorites System**: Save and organize favorite restaurants and dishes
- **User Profiles**: Complete user account management with order history
- **Payment Integration**: Secure payment processing with multiple payment methods
- **Location Services**: GPS-based restaurant discovery and delivery tracking
- **Push Notifications**: Real-time order updates and promotional offers

## Tech Stack

- **Framework**: React Native with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation with stack and tab navigators
- **UI**: Custom components with premium design system
- **Styling**: StyleSheet API with custom theme system
- **API**: Axios-based HTTP client with mock data support
- **Real-time**: WebSocket integration for live updates

## Getting Started

### Prerequisites

- Node.js 16+
- React Native development environment
- iOS/Android emulator or physical device

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vibes-customer-app

# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure your API endpoints and other environment variables
3. Update the mock data or connect to your backend API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   ├── restaurant/     # Restaurant-specific components
│   ├── cart/           # Cart and checkout components
│   └── profile/        # Profile-related components
├── screens/            # Main app screens
│   ├── auth/           # Authentication screens
│   └── cart/           # Cart and checkout screens
├── navigation/         # Navigation configuration
├── store/              # Redux store and slices
├── services/           # API services and utilities
├── theme/              # Design system and colors
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── assets/             # Images, icons, fonts
```

## Design System

### Color Palette

The app uses a sophisticated purple gradient color scheme:

- Primary: `#42033D` → `#854798`
- Secondary: `#550944` → `#815D9C`
- Background: `#1A0A1A`
- Text: `#FFFFFF` with opacity variations

### Typography

Modern sans-serif fonts with consistent hierarchy:
- SFProDisplay-Bold (H1: 32px, H2: 24px, H3: 20px)
- SFProDisplay-Semibold (Buttons, Labels: 16px)
- SFProDisplay-Regular (Body: 16px, 14px, 12px)

### Spacing

Consistent spacing system based on 4px grid:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

## Development

### Code Quality

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Component-based architecture
- Redux Toolkit for predictable state management

### Testing

- Jest + React Native Testing Library for unit tests
- Detox for end-to-end testing
- Mock data services for development

### Performance Optimizations

- List virtualization for large datasets
- Image lazy loading and caching
- State normalization with Redux Toolkit
- Debounced search and API calls

## API Integration

The app includes a complete mock data service that simulates:
- Restaurant browsing and search
- Menu items and categories
- User authentication
- Cart management
- Order placement and tracking
- Location services

To connect to a real backend, update the `apiClient.ts` configuration and replace mock service calls with actual API endpoints.

## Contributing

1. Follow the established code patterns and naming conventions
2. Ensure TypeScript types are properly defined
3. Test your changes thoroughly
4. Update documentation for new features

## License

[License information]

---

**Project Perseus** - Delivering the universe, one meal at a time.