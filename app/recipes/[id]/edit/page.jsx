'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/layout/ProtectedRoute';
import SafeImage from '../../../../components/ui/SafeImage';

export default function EditRecipe({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
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
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          const recipe = result.data;
          
          setFormData({
            name: recipe.name || '',
            description: recipe.description || '',
            cuisine: recipe.cuisine || '',
            image: recipe.image || '',
            prepTime: recipe.prepTime || '',
            cookTime: recipe.cookTime || '',
            servings: recipe.servings || '',
            difficulty: recipe.difficulty || 'Easy',
            tags: recipe.tags ? recipe.tags.join(', ') : '',
            createdBy: recipe.createdBy || 'Anonymous',
            ingredients: recipe.ingredients && recipe.ingredients.length > 0 
              ? recipe.ingredients 
              : [{ name: '', amount: '' }],
            instructions: recipe.instructions && recipe.instructions.length > 0 
              ? recipe.instructions 
              : [{ step: 1, instruction: '' }]
          });
        } else {
          alert('Recipe not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Error loading recipe');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index].instruction = value;
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { step: prev.instructions.length + 1, instruction: '' }]
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      // Update step numbers
      newInstructions.forEach((instruction, i) => {
        instruction.step = i + 1;
      });
      setFormData(prev => ({
        ...prev,
        instructions: newInstructions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse tags
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Prepare data for API
      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        tags: tagsArray,
        ingredients: formData.ingredients.filter(ing => ing.name && ing.amount),
        instructions: formData.instructions.filter(inst => inst.instruction)
      };

      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Recipe updated successfully!');
        router.push(`/recipes/${params.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="text-white text-xl">Loading recipe...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8 text-center text-shadow">
              ✏️ Edit Recipe
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Recipe Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="Enter recipe name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Cuisine *</label>
                  <input
                    type="text"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g., Italian, Mexican, Asian"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                  placeholder="Describe your recipe..."
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-4">
                    <label className="block text-white font-semibold mb-2">Image Preview:</label>
                    <div className="glass-effect p-4 rounded-lg">
                      <SafeImage
                        src={formData.image}
                        alt="Recipe preview"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time and Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Prep Time (min) *</label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Cook Time (min) *</label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Servings *</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg glass-effect text-white border border-white/20 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="vegetarian, quick, healthy (comma separated)"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-white font-semibold">Ingredients *</label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="glass-effect px-4 py-2 rounded-lg text-white hover:bg-green-500 transition-all duration-300"
                  >
                    + Add Ingredient
                  </button>
                </div>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1 p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      className="flex-1 p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="glass-effect px-4 py-3 rounded-lg text-white hover:bg-red-500 transition-all duration-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-white font-semibold">Instructions *</label>
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="glass-effect px-4 py-2 rounded-lg text-white hover:bg-green-500 transition-all duration-300"
                  >
                    + Add Step
                  </button>
                </div>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {instruction.step}
                    </span>
                    <textarea
                      placeholder="Enter instruction step..."
                      value={instruction.instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      className="flex-1 p-3 rounded-lg glass-effect text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="glass-effect px-4 py-3 rounded-lg text-white hover:bg-red-500 transition-all duration-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="glass-effect px-8 py-4 rounded-full text-white font-semibold hover:bg-blue-500 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Updating Recipe...' : '💾 Update Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
