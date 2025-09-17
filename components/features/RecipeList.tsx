import React from "react";
import SafeImage from "../ui/SafeImage";
import Link from "next/link";
import AddToCart from "./AddToCart";
import { RecipeListProps } from "../../types";

const RecipeList: React.FC<RecipeListProps> = ({ recipes, type }) => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto server">
      {recipes?.map((recipe, idx) => {
        return (
          <div
            className="group glass-effect rounded-2xl overflow-hidden server card hover-lift animate-fade-in-up"
            key={recipe._id || idx}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="relative overflow-hidden">
              <SafeImage
                alt={recipe.name || "Recipe"}
                src={recipe.image || "https://via.placeholder.com/400x300"}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                {recipe.difficulty}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-yellow-400 text-sm font-medium bg-yellow-400/20 px-2 py-1 rounded-full">
                  {recipe.cuisine}
                </span>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-2">⏱️</span>
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                {recipe.name}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-1">👥</span>
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-1">👨‍🍳</span>
                  <span>{recipe.createdBy}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {recipe.tags?.slice(0, 3).map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="bg-white/10 text-white text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Interaction counts */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-white bg-red-500/20 px-2 py-1 rounded-full">
                    <span>❤️</span>
                    <span className="font-semibold">{recipe.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white bg-blue-500/20 px-2 py-1 rounded-full">
                    <span>💬</span>
                    <span className="font-semibold">{recipe.commentsCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white bg-yellow-500/20 px-2 py-1 rounded-full">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="font-semibold">{recipe.averageRating || 0}</span>
                    <span className="text-gray-400 text-xs">({recipe.ratingsCount || 0})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Link
                  href={`/recipes/${recipe._id}`}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover-lift text-center"
                >
                  👁️ View Recipe
                </Link>
                <AddToCart recipeId={recipe._id} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;

