import React from "react";
import SafeImage from "./SafeImage";
import Link from "next/link";

//Components
import AddToCart from "./AddToCart";

const RecipeList = ({ recipes, type }) => {
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
                width={500}
                height={500}
                src={recipe.image || "/placeholder-recipe.jpg"}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4">
                <span className="glass-effect px-3 py-1 rounded-full text-white text-sm font-semibold">
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="font-bold text-xl mb-3 text-white group-hover:text-yellow-300 transition-colors duration-300">
                {recipe.name}
              </h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🏷️</span>
                  <span className="capitalize">{recipe.cuisine}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Link href={`/recipes/${recipe._id}`}>
                  <button className="glass-effect px-4 py-2 rounded-full text-white font-semibold hover:bg-blue-500 transition-all duration-300 hover-lift">
                    👁️ View Recipe
                  </button>
                </Link>
                <AddToCart recipeId={recipe._id} name={recipe.name} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;
