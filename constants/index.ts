// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    RECIPES: '/api/recipes',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    CART: '/api/cart',
    CUISINES: '/api/cuisines',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Recipe Finder',
  DESCRIPTION: 'A modern recipe management application',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
} as const;

// Recipe Constants
export const RECIPE_CONSTANTS = {
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'] as const,
  DEFAULT_IMAGE: '/placeholder-recipe.jpg',
  MAX_INGREDIENTS: 20,
  MAX_INSTRUCTIONS: 15,
} as const;

// Auth Constants
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  TOKEN_EXPIRY: '7d',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  RECIPE_CREATED: 'Recipe created successfully!',
  RECIPE_UPDATED: 'Recipe updated successfully!',
  RECIPE_DELETED: 'Recipe deleted successfully!',
  ITEM_ADDED_TO_CART: 'Item added to cart!',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;

