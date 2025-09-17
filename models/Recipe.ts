import mongoose, { Document, Schema, Types } from 'mongoose';
import { Ingredient, Instruction, DifficultyLevel } from '../types';

// Interface for recipe comments
export interface IRecipeComment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for recipe likes
export interface IRecipeLike {
  user: Types.ObjectId;
  createdAt: Date;
}

// Interface for recipe ratings
export interface IRecipeRating {
  user: Types.ObjectId;
  rating: number; // 1-5 stars
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the Recipe document (without extending the base Recipe interface to avoid _id conflicts)
export interface IRecipe extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  cuisine: string;
  image?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: DifficultyLevel;
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  likes: IRecipeLike[];
  comments: IRecipeComment[];
  ratings: IRecipeRating[];
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual fields
  likesCount: number;
  commentsCount: number;
  averageRating: number;
  ratingsCount: number;
}

// Schema for ingredients
const IngredientSchema = new Schema<Ingredient>({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  }
});

// Schema for instructions
const InstructionSchema = new Schema<Instruction>({
  step: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true
  }
});

// Schema for recipe comments
const RecipeCommentSchema = new Schema<IRecipeComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Schema for recipe likes
const RecipeLikeSchema = new Schema<IRecipeLike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Schema for recipe ratings
const RecipeRatingSchema = new Schema<IRecipeRating>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, {
  timestamps: true
});

// Main Recipe schema
const RecipeSchema = new Schema<IRecipe>({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Recipe name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  image: {
    type: String,
  },
  ingredients: [IngredientSchema],
  instructions: [InstructionSchema],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'] as DifficultyLevel[],
    required: [true, 'Difficulty level is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: String,
    default: 'Anonymous'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: {
    type: [RecipeLikeSchema],
    default: []
  },
  comments: {
    type: [RecipeCommentSchema],
    default: []
  },
  ratings: {
    type: [RecipeRatingSchema],
    default: []
  }
}, {
  timestamps: true
});

// Virtual for likes count
RecipeSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
RecipeSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Virtual for ratings count
RecipeSchema.virtual('ratingsCount').get(function() {
  return this.ratings.length;
});

// Virtual for average rating
RecipeSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal place
});

// Ensure virtual fields are serialized
RecipeSchema.set('toJSON', { virtuals: true });
RecipeSchema.set('toObject', { virtuals: true });

// Create indexes for better performance
RecipeSchema.index({ name: 'text', description: 'text' });
RecipeSchema.index({ cuisine: 1 });
RecipeSchema.index({ tags: 1 });
RecipeSchema.index({ 'likes.user': 1 });
RecipeSchema.index({ 'ratings.user': 1 });

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
