import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
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
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    }
  }],
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
    enum: ['Easy', 'Medium', 'Hard'],
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
  }
}, {
  timestamps: true
});

// Create indexes for better performance
RecipeSchema.index({ name: 'text', description: 'text' });
RecipeSchema.index({ cuisine: 1 });
RecipeSchema.index({ tags: 1 });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
