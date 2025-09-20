/* eslint-disable react/no-unescaped-entities */
import React from "react";
import RecipeList from "../../components/features/RecipeList";
import SearchBar from "../../components/features/SearchBar";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import { Recipe } from "../../types";
import { API_CONFIG } from "../../constants";

async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/recipes?search=${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      throw new Error('Failed to search recipes');
    }
    
    const response = await res.json();
    return response.data || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const recipes = query ? await searchRecipes(query) : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-6">
              🔍 Search Recipes
            </h1>
            <SearchBar />
          </div>

          {query && (
            <div className="mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Search results for "{query}"
              </h2>
              <p className="text-gray-200">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {query && recipes.length > 0 && (
            <RecipeList recipes={recipes} type="search" />
          )}

          {query && recipes.length === 0 && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <p className="text-white text-xl mb-4">
                  No recipes found for "{query}". Try a different search term.
                </p>
              </div>
            </div>
          )}

          {!query && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <p className="text-white text-xl">
                  Enter a search term above to find recipes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

