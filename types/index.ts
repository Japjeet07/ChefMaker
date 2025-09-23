// Base types
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Recipe types
export interface Ingredient {
  name: string;
  amount: string;
}

export interface Instruction {
  step: number;
  instruction: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface RecipeComment {
  _id: string;
  user: UserWithoutPassword;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeLike {
  user: string;
  createdAt: string;
}

export interface RecipeRating {
  user: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe extends BaseEntity {
  name: string;
  description: string;
  cuisine: string;
  image: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: DifficultyLevel;
  tags: string[];
  createdBy: string | UserWithoutPassword;
  isPublic: boolean;
  likes?: RecipeLike[];
  comments?: RecipeComment[];
  ratings?: RecipeRating[];
  likesCount?: number;
  commentsCount?: number;
  averageRating?: number;
  ratingsCount?: number;
}

// User types
export interface CartItem {
  _id: string;
  recipe: Recipe | string; // Can be populated Recipe object or ObjectId string
  quantity: number;
  addedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  favorites: string[];
  cart: CartItem[];
  followers: string[];
  following: string[];
  bio?: string;
  isActive: boolean;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

// Cart types
export interface AddToCartRequest {
  recipeId: string;
  quantity?: number;
}

export interface RemoveFromCartRequest {
  itemId: string;
}

// Recipe interaction types
export interface AddRecipeCommentRequest {
  content: string;
}

export interface AddRecipeRatingRequest {
  rating: number; // 0 to remove rating, 1-5 to set rating
}

// Recipe form types
export interface RecipeFormData {
  name: string;
  description: string;
  cuisine: string;
  image: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: DifficultyLevel;
  tags: string[];
}

// Search types
export interface SearchParams {
  q?: string;
  cuisine?: string;
  page?: number;
  limit?: number;
}

// Component Props types
export interface RecipeListProps {
  recipes: Recipe[];
  type?: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
}

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export interface AddToCartProps {
  recipeId: string;
  onAdd?: () => void;
}

export interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any;
}

// Context types
export interface AuthContextType {
  user: UserWithoutPassword | null;
  loading: boolean;
  login: (userData: UserWithoutPassword, token: string, redirectCallback?: () => void) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  requireAuth: (callback: () => void) => boolean;
  showLogoutAnimation: boolean;
  completeLogout: () => void;
  showWelcomeAnimation: boolean;
  completeWelcome: () => void;
  updateUser: (updatedUser: UserWithoutPassword) => void;
}

// Form types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Blog types
export interface BlogComment {
  _id: string;
  user: UserWithoutPassword;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogLike {
  user: string;
  createdAt: string;
}

export interface Blog extends BaseEntity {
  title: string;
  content: string;
  image?: string;
  video?: string;
  author: UserWithoutPassword;
  tags: string[];
  likes?: BlogLike[];
  comments?: BlogComment[];
  isPublic: boolean;
  likesCount?: number;
  commentsCount?: number;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  image?: string;
  video?: string;
  tags: string[];
  isPublic?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  image?: string;
  video?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface BlogFormData {
  title: string;
  content: string;
  image: string;
  video: string;
  tags: string;
  isPublic: boolean;
}

// Social/Profile types
export interface UserProfile extends UserWithoutPassword {
  followersCount: number;
  followingCount: number;
  recipesCount: number;
  blogsCount: number;
  isFollowing?: boolean; // For current user's relationship with this profile
}

export interface FollowRequest {
  userId: string;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  recipesCount: number;
  blogsCount: number;
}

// Assistant Chef types
export interface ChefPersonality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: 'abrasive' | 'spiritual' | 'educational' | 'enthusiastic';
  specialty: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

// Utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

