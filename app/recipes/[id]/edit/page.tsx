'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/layout/ProtectedRoute';
import SafeImage from '../../../../components/ui/SafeImage';
import { Recipe, Ingredient, Instruction } from '../../../../types';

interface EditRecipeProps {
  params: Promise<{
    id: string;
  }>;
}

interface FormData {
  name: string;
  description: string;
  cuisine: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  tags: string;
  createdBy: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export default async function EditRecipe({ params }: EditRecipeProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [recipeId, setRecipeId] = useState<string>(id);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    cuisine: '',
    image: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    tags: '',
    createdBy: 'Anonymous',
    ingredients: [{ name: '', amount: '' }],
    instructions: [{ step: 1, instruction: '' }]
  });


  useEffect(() => {
    const fetchRecipe = async (): Promise<void> => {
      try {
        if (!recipeId) return;
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (response.ok) {
          const data = await response.json();
          const recipe: Recipe = data.data;
          
          setFormData({
            name: recipe.name,
            description: recipe.description,
            cuisine: recipe.cuisine,
            image: recipe.image || '',
            prepTime: recipe.prepTime.toString(),
            cookTime: recipe.cookTime.toString(),
            servings: recipe.servings.toString(),
            difficulty: recipe.difficulty,
            tags: recipe.tags?.join(', ') || '',
            createdBy: typeof recipe.createdBy === 'string' ? recipe.createdBy : (recipe.createdBy as any)?.name || 'Anonymous',
            ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '' }],
            instructions: recipe.instructions.length > 0 ? recipe.instructions : [{ step: 1, instruction: '' }]
          });
        } else {
          alert('Failed to fetch recipe');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Failed to fetch recipe');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string): void => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = (): void => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }]
    }));
  };

  const removeIngredient = (index: number): void => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleInstructionChange = (index: number, value: string): void => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = { ...newInstructions[index], instruction: value };
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = (): void => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { step: prev.instructions.length + 1, instruction: '' }]
    }));
  };

  const removeInstruction = (index: number): void => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      // Update step numbers
      const updatedInstructions = newInstructions.map((instruction, i) => ({
        ...instruction,
        step: i + 1
      }));
      setFormData(prev => ({
        ...prev,
        instructions: updatedInstructions
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          prepTime: parseInt(formData.prepTime),
          cookTime: parseInt(formData.cookTime),
          servings: parseInt(formData.servings),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          ingredients: formData.ingredients.filter(ing => ing.name && ing.amount),
          instructions: formData.instructions.filter(inst => inst.instruction)
        }),
      });

      if (response.ok) {
        alert('Recipe updated successfully!');
        router.push(`/recipes/${recipeId}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update recipe');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-white text-xl">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
              ✏️ Edit Recipe
            </h1>
            <p className="text-xl text-gray-200 text-shadow">
              Update your delicious creation
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter recipe name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Cuisine *
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Thai">Thai</option>
                    <option value="Korean">Korean</option>
                    <option value="Greek">Greek</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                    <option value="British">British</option>
                    <option value="Brazilian">Brazilian</option>
                    <option value="Turkish">Turkish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Describe your recipe..."
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-4">
                    <SafeImage
                      src={formData.image}
                      alt="Recipe preview"
                      width={200}
                      height={200}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Time and Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="4"
                  />
                </div>
              </div>

              {/* Difficulty and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="healthy, vegetarian, quick"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-white font-semibold">
                    Ingredients *
                  </label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover-lift"
                  >
                    + Add Ingredient
                  </button>
                </div>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-4 mb-3">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      placeholder="Amount"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover-lift"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-white font-semibold">
                    Instructions *
                  </label>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover-lift"
                  >
                    + Add Step
                  </button>
                </div>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={instruction.instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          placeholder="Describe this step..."
                          rows={2}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                      {formData.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover-lift"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 hover-lift disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin">⏳</div>
                      <span>Updating Recipe...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>💾</span>
                      <span>Update Recipe</span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

