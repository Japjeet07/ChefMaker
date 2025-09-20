import mongoose, { Document, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Interface for cart items
export interface ICartItem {
  recipe: Types.ObjectId;
  quantity: number;
  addedAt: Date;
}

// Interface for the User document (without extending the base User interface to avoid _id conflicts)
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  favorites: Types.ObjectId[];
  cart: ICartItem[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(candidatePassword: string): Promise<boolean>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema for cart items
const CartItemSchema = new Schema<ICartItem>({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  quantity: {
    type: Number,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Main User schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  // Temporary field to handle old database index - will be removed after migration
  username: {
    type: String,
    default: function() {
      return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  cart: [CartItemSchema],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  // Generate unique username for new users to handle old database index
  if (this.isNew && !this.username) {
    this.username = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Alias for comparePassword (for backward compatibility)
UserSchema.methods.matchPassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
