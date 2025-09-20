import React from "react";
import Link from "next/link";
import { Recipe } from "../../../types";

//components
import RecipeList from "../../../components/features/RecipeList";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";

async function getRecipes(cuisine: string): Promise<Recipe[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' ? 'https://chefmaker.onrender.com' : 'http://localhost:3000');
    
    const res = await fetch(
      `${baseUrl}/api/recipes?cuisine=${encodeURIComponent(cuisine)}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Failed to fetch recipes: ${res.status} ${res.statusText}`, errorData);
      throw new Error(`Failed to fetch recipes: ${errorData.message || res.statusText}`);
    }
    
    const response = await res.json();
    
    if (!response.success) {
      console.error('API returned error:', response);
      throw new Error(response.message || 'API request failed');
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

interface RecipeListContainerProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function RecipeListContainer({ params }: RecipeListContainerProps): Promise<React.JSX.Element> {
  const { type } = await params;
  const recipes = await getRecipes(type);

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4 capitalize">
              🍽️ {type} Recipes
            </h1>
            <p className="text-xl text-gray-200 text-shadow">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {recipes.length > 0 ? (
            <RecipeList recipes={recipes} type={type || ""} />
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

