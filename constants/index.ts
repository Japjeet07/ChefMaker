// Environment Configuration
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV ,
  JWT_SECRET: process.env.JWT_SECRET ,
  MONGODB_URI: process.env.MONGODB_URI
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || (() => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://chefmaker.onrender.com';
    }
    return 'http://localhost:3000';
  })(),
  ENDPOINTS: {
    RECIPES: '/api/recipes',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    CART: '/api/cart',
    CUISINES: '/api/cuisines',
    BLOGS: '/api/blogs',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'LetHimCook',
  DESCRIPTION: 'A modern recipe management application',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
} as const;

// External URLs and Assets
export const EXTERNAL_URLS = {
  CLOUD_IMAGE: 'https://assets.codepen.io/557388/clouds.png',
  PLANE_MODEL: 'https://assets.codepen.io/557388/1405+Plane_1.obj',
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=No+Image+Available',
  THEMEALDB_API: 'https://www.themealdb.com/api/json/v1/1',
  SOCIAL_SHARE: {
    TWITTER: 'https://twitter.com/intent/tweet',
    FACEBOOK: 'https://www.facebook.com/sharer/sharer.php',
    WHATSAPP: 'https://wa.me/',
    TELEGRAM: 'https://t.me/share/url',
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

