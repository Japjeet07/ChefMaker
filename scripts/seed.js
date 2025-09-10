const mongoose = require('mongoose');

// Recipe Schema
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
    required: [true, 'Recipe image is required']
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

const Recipe = mongoose.model('Recipe', RecipeSchema);

const sampleRecipes = [
  {
    name: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish with eggs, cheese, and pancetta.",
    cuisine: "Italian",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500",
    ingredients: [
      { name: "Spaghetti", amount: "400g" },
      { name: "Pancetta", amount: "200g" },
      { name: "Eggs", amount: "4 large" },
      { name: "Parmesan cheese", amount: "100g grated" },
      { name: "Black pepper", amount: "1 tsp" },
      { name: "Salt", amount: "to taste" }
    ],
    instructions: [
      { step: 1, instruction: "Cook spaghetti according to package directions until al dente." },
      { step: 2, instruction: "Meanwhile, cook pancetta in a large skillet until crispy." },
      { step: 3, instruction: "Whisk eggs with grated Parmesan and black pepper in a bowl." },
      { step: 4, instruction: "Drain pasta and immediately add to pancetta pan." },
      { step: 5, instruction: "Remove from heat and quickly stir in egg mixture until creamy." },
      { step: 6, instruction: "Serve immediately with extra Parmesan and black pepper." }
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    tags: ["pasta", "italian", "quick", "comfort food"],
    createdBy: "Chef Mario"
  },
  {
    name: "Chicken Tikka Masala",
    description: "Creamy and flavorful Indian curry with tender chicken pieces.",
    cuisine: "Indian",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    ingredients: [
      { name: "Chicken breast", amount: "500g cubed" },
      { name: "Yogurt", amount: "1 cup" },
      { name: "Tomato sauce", amount: "400ml" },
      { name: "Heavy cream", amount: "200ml" },
      { name: "Onion", amount: "1 large" },
      { name: "Garlic", amount: "4 cloves" },
      { name: "Ginger", amount: "1 inch piece" },
      { name: "Garam masala", amount: "2 tsp" },
      { name: "Turmeric", amount: "1 tsp" },
      { name: "Cumin", amount: "1 tsp" }
    ],
    instructions: [
      { step: 1, instruction: "Marinate chicken in yogurt with half the spices for 30 minutes." },
      { step: 2, instruction: "Sauté onions until golden, add garlic and ginger." },
      { step: 3, instruction: "Add remaining spices and cook until fragrant." },
      { step: 4, instruction: "Add tomato sauce and simmer for 10 minutes." },
      { step: 5, instruction: "Add marinated chicken and cook until done." },
      { step: 6, instruction: "Stir in cream and simmer for 5 minutes." }
    ],
    prepTime: 40,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    tags: ["curry", "indian", "spicy", "chicken"],
    createdBy: "Chef Priya"
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade chocolate chip cookies.",
    cuisine: "American",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
    ingredients: [
      { name: "All-purpose flour", amount: "2 1/4 cups" },
      { name: "Butter", amount: "1 cup softened" },
      { name: "Brown sugar", amount: "3/4 cup" },
      { name: "White sugar", amount: "1/4 cup" },
      { name: "Eggs", amount: "2 large" },
      { name: "Vanilla extract", amount: "2 tsp" },
      { name: "Baking soda", amount: "1 tsp" },
      { name: "Salt", amount: "1 tsp" },
      { name: "Chocolate chips", amount: "2 cups" }
    ],
    instructions: [
      { step: 1, instruction: "Preheat oven to 375°F (190°C)." },
      { step: 2, instruction: "Cream butter and both sugars until fluffy." },
      { step: 3, instruction: "Beat in eggs one at a time, then vanilla." },
      { step: 4, instruction: "Mix in flour, baking soda, and salt." },
      { step: 5, instruction: "Fold in chocolate chips." },
      { step: 6, instruction: "Drop rounded tablespoons onto ungreased baking sheets." },
      { step: 7, instruction: "Bake 9-11 minutes until golden brown." }
    ],
    prepTime: 15,
    cookTime: 11,
    servings: 24,
    difficulty: "Easy",
    tags: ["dessert", "cookies", "chocolate", "baking"],
    createdBy: "Chef Sarah"
  },
  {
    name: "Beef Stir Fry",
    description: "Quick and healthy beef stir fry with vegetables.",
    cuisine: "Chinese",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
    ingredients: [
      { name: "Beef sirloin", amount: "400g sliced" },
      { name: "Broccoli", amount: "2 cups" },
      { name: "Bell peppers", amount: "2 sliced" },
      { name: "Carrots", amount: "2 sliced" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Garlic", amount: "3 cloves" },
      { name: "Ginger", amount: "1 tbsp grated" },
      { name: "Sesame oil", amount: "1 tbsp" },
      { name: "Cornstarch", amount: "1 tbsp" }
    ],
    instructions: [
      { step: 1, instruction: "Marinate beef with soy sauce and cornstarch for 15 minutes." },
      { step: 2, instruction: "Heat oil in a wok or large pan over high heat." },
      { step: 3, instruction: "Stir-fry beef until browned, remove and set aside." },
      { step: 4, instruction: "Add vegetables and stir-fry for 3-4 minutes." },
      { step: 5, instruction: "Return beef to pan with garlic and ginger." },
      { step: 6, instruction: "Cook for 1-2 minutes more and serve hot." }
    ],
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    tags: ["stir fry", "beef", "vegetables", "quick", "healthy"],
    createdBy: "Chef Li"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-finder');
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert sample recipes
    await Recipe.insertMany(sampleRecipes);
    console.log('Inserted sample recipes');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
