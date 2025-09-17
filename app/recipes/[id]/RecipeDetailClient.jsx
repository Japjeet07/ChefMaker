"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "../../../components/ui/SafeImage";
import { useRouter } from "next/navigation";
import AddToCart from "../../../components/features/AddToCart";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";

export default function RecipeDetailClient({ recipe }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${recipe._id}`, {
        method: 'DELETE',
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
      alert('Error deleting recipe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 animate-fade-in-up">
            <Link
              href={`/types/${recipe.cuisine}`}
              className="glass-effect px-4 py-2 rounded-full text-white hover:bg-blue-500 transition-all duration-300 hover-lift inline-flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to {recipe.cuisine} recipes</span>
            </Link>
          </div>

          <div className="glass-effect rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="md:flex">
              <div className="md:w-1/2 relative">
                <SafeImage
                  src={recipe.image}
                  alt={recipe.name}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <span className="glass-effect px-3 py-1 rounded-full text-white text-sm font-semibold">
                      {recipe.difficulty}
                    </span>
                    <span className="glass-effect px-3 py-1 rounded-full text-white text-sm font-semibold">
                      {recipe.cuisine}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-8">
                <h1 className="text-4xl font-bold text-white mb-4 text-shadow">
                  {recipe.name}
                </h1>
                <p className="text-gray-200 mb-6 text-lg">{recipe.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center glass-effect p-4 rounded-2xl">
                    <div className="text-3xl font-bold text-blue-400 mb-1">{recipe.prepTime}</div>
                    <div className="text-sm text-gray-300">Prep Time (min)</div>
                  </div>
                  <div className="text-center glass-effect p-4 rounded-2xl">
                    <div className="text-3xl font-bold text-green-400 mb-1">{recipe.cookTime}</div>
                    <div className="text-sm text-gray-300">Cook Time (min)</div>
                  </div>
                  <div className="text-center glass-effect p-4 rounded-2xl">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{recipe.servings}</div>
                    <div className="text-sm text-gray-300">Servings</div>
                  </div>
                </div>

                {recipe.tags?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">🏷️ Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="glass-effect text-white px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <AddToCart recipeId={recipe._id} name={recipe.name} />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="md:grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">🥘</span>
                    Ingredients
                  </h2>
                  <div className="glass-effect p-6 rounded-2xl">
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-center text-white">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                            {ingredient.name}
                          </span>
                          <span className="font-semibold text-yellow-300">{ingredient.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3">👨‍🍳</span>
                    Instructions
                  </h2>
                  <div className="glass-effect p-6 rounded-2xl">
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                            {instruction.step}
                          </span>
                          <span className="text-white leading-relaxed">{instruction.instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 glass-effect-dark border-t border-white/10">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <p className="text-sm text-gray-300 mb-1">
                    👤 Created by: <span className="font-semibold">{recipe.createdBy}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    📅 Created: {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-3">
                  <Link
                    href={`/recipes/${recipe._id}/edit`}
                    className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-yellow-500 transition-all duration-300 hover-lift"
                  >
                    ✏️ Edit Recipe
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-red-500 transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Recipe'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
