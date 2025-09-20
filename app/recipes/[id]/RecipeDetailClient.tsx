"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "../../../components/ui/SafeImage";
import { useRouter } from "next/navigation";
import AddToCart from "../../../components/features/AddToCart";
import RecipeInteraction from "../../../components/features/RecipeInteraction";
import ShareRecipe from "../../../components/features/ShareRecipe";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { Recipe } from "../../../types";

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export default function RecipeDetailClient({ recipe }: RecipeDetailClientProps): React.JSX.Element {
  const router = useRouter();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipe);
  
  // Check if current user is the owner of the recipe
  const isOwner = user && (
    (typeof recipe.createdBy === 'string' && recipe.createdBy === user._id) ||
    (typeof recipe.createdBy === 'object' && recipe.createdBy._id === user._id)
  );

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/recipes/${recipe._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Recipe deleted successfully!');
        router.push('/');
      } else {
        const error = await response.json();
        alert(`Error deleting recipe: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-blue-500 transition-all duration-300 hover-lift flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
              
              <div className="flex space-x-4">
                <ShareRecipe recipe={recipe} />
                
                {isOwner && (
                  <>
                    <Link
                      href={`/recipes/${recipe._id}/edit`}
                      className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-green-500 transition-all duration-300 hover-lift flex items-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Edit Recipe</span>
                    </Link>
                    
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-red-500 transition-all duration-300 hover-lift flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin">⏳</div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          <span>Delete Recipe</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
              {recipe.name}
            </h1>
            <p className="text-xl text-gray-200 text-shadow mb-6">
              {recipe.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="glass-effect rounded-2xl p-6">
                  <SafeImage
                    src={recipe.image || 'https://via.placeholder.com/600x400'}
                    alt={recipe.name}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Recipe Info */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="glass-effect rounded-2xl p-6">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">📊</span>
                    Recipe Information
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⏱️</div>
                      <div className="text-white font-semibold">Prep Time</div>
                      <div className="text-yellow-400 text-lg">{recipe.prepTime} min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="text-white font-semibold">Cook Time</div>
                      <div className="text-yellow-400 text-lg">{recipe.cookTime} min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="text-white font-semibold">Servings</div>
                      <div className="text-yellow-400 text-lg">{recipe.servings}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-white font-semibold">Difficulty</div>
                      <div className="text-yellow-400 text-lg">{recipe.difficulty}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="glass-effect rounded-2xl p-6">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">🥘</span>
                    Ingredients
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                      >
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-white font-medium">{ingredient.amount}</span>
                        <span className="text-gray-300">{ingredient.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="glass-effect rounded-2xl p-6">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">📝</span>
                    Instructions
                  </h2>
                  
                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                          {instruction.step}
                        </div>
                        <p className="text-white leading-relaxed">{instruction.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Add to Cart */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="glass-effect rounded-2xl p-6 sticky top-24">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-3">🛒</span>
                    Add to Cart
                  </h3>
                  <AddToCart recipeId={recipe._id} />
                </div>
              </div>

              {/* Recipe Details */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-3">🏷️</span>
                    Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-300 text-sm">Cuisine</div>
                      <div className="text-white font-semibold">{recipe.cuisine}</div>
                    </div>
                    
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div>
                        <div className="text-gray-300 text-sm mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-gray-300 text-sm">Created by</div>
                      <div className="text-white font-semibold">{typeof recipe.createdBy === 'object' ? recipe.createdBy.name : recipe.createdBy}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Interactions */}
          <div className="mt-8">
            <RecipeInteraction 
              recipe={currentRecipe} 
              onUpdate={setCurrentRecipe}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

