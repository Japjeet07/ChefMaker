import React from "react";
import Link from "next/link";

//components
import RecipeList from "../../../components/RecipeList";
import ProtectedRoute from "../../../components/ProtectedRoute";

async function getRecipes(cuisine) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chefmaker.onrender.com' : 'http://localhost:3000')}/api/recipes?cuisine=${encodeURIComponent(cuisine)}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const response = await res.json();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function RecipeListContainer({ params }) {
  const recipes = await getRecipes(params.type);

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4 capitalize">
              🍽️ {params.type} Recipes
            </h1>
            <p className="text-xl text-gray-200 text-shadow">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {recipes.length > 0 ? (
            <RecipeList recipes={recipes} type={params.type || ""} />
          ) : (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">🍽️</div>
                <p className="text-white text-xl mb-6">No recipes found for this cuisine.</p>
                <Link
                  href="/recipes/new"
                  className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-green-500 transition-all duration-300 hover-lift"
                >
                  ✨ Add the First Recipe
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
