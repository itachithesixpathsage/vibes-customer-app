export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Specific spacing values
  // Margins and padding
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Component specific spacing
  button: {
    horizontal: 24,
    vertical: 12,
    icon: 8,
  },

  card: {
    padding: 16,
    margin: 8,
    borderRadius: 16,
  },

  input: {
    horizontal: 16,
    vertical: 12,
    margin: 8,
  },

  screen: {
    padding: 16,
    margin: 16,
  },

  list: {
    item: 12,
    section: 24,
  },

  // Layout spacing
  container: {
    padding: 16,
    margin: 8,
  },

  section: {
    margin: 24,
    padding: 16,
  },

  // Gap spacing for flex layouts
  gap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  // Border radius values
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
  },

  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Button dimensions
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
    },
  },

  // Image and media
  image: {
    borderRadius: 12,
    aspectRatio: {
      square: 1,
      landscape: 16/9,
      portrait: 3/4,
      restaurant: 4/3,
      food: 1/1,
    },
  },

  // Screen-specific spacing
  screenPadding: {
    horizontal: 16,
    vertical: 8,
  },

  // Safe area insets (approximate)
  safeArea: {
    top: 44, // Status bar + notch
    bottom: 34, // Home indicator
    sides: 0,
  },
};

// Spacing utilities
export const spacingUtils = {
  // Create margin object
  margin: (value: number) => ({
    margin: value,
  }),

  // Create margin specific sides
  marginTop: (value: number) => ({
    marginTop: value,
  }),

  marginRight: (value: number) => ({
    marginRight: value,
  }),

  marginBottom: (value: number) => ({
    marginBottom: value,
  }),

  marginLeft: (value: number) => ({
    marginLeft: value,
  }),

  // Create margin horizontal/vertical
  marginHorizontal: (value: number) => ({
    marginHorizontal: value,
  }),

  marginVertical: (value: number) => ({
    marginVertical: value,
  }),

  // Create padding object
  padding: (value: number) => ({
    padding: value,
  }),

  // Create padding specific sides
  paddingTop: (value: number) => ({
    paddingTop: value,
  }),

  paddingRight: (value: number) => ({
    paddingRight: value,
  }),

  paddingBottom: (value: number) => ({
    paddingBottom: value,
  }),

  paddingLeft: (value: number) => ({
    paddingLeft: value,
  }),

  // Create padding horizontal/vertical
  paddingHorizontal: (value: number) => ({
    paddingHorizontal: value,
  }),

  paddingVertical: (value: number) => ({
    paddingVertical: value,
  }),

  // Create gap for flex layouts
  gap: (value: number) => ({
    gap: value,
  }),

  // Create row gap for flex layouts
  rowGap: (value: number) => ({
    rowGap: value,
  }),

  // Create column gap for flex layouts
  columnGap: (value: number) => ({
    columnGap: value,
  }),
};

export type SpacingKeys = keyof typeof spacing;
export type BorderRadiusKeys = keyof typeof spacing.borderRadius;