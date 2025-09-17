import React from "react";

const RecipeDetailLoading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-12 w-3/4 mx-auto bg-white/20 rounded-lg mb-4"></div>
          <div className="h-6 w-1/2 mx-auto bg-white/20 rounded-lg"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image skeleton */}
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="w-full h-64 bg-white/20 rounded-lg mb-4"></div>
            </div>

            {/* Ingredients skeleton */}
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="h-8 w-1/3 bg-white/20 rounded-lg mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="h-4 bg-white/20 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions skeleton */}
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="h-8 w-1/3 bg-white/20 rounded-lg mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/20 rounded w-full"></div>
                      <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Add to cart skeleton */}
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="h-8 w-1/2 bg-white/20 rounded-lg mb-4"></div>
              <div className="h-12 bg-white/20 rounded-lg"></div>
            </div>

            {/* Details skeleton */}
            <div className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="h-8 w-1/3 bg-white/20 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactions skeleton */}
        <div className="mt-8 space-y-6">
          <div className="glass-effect rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <div className="h-8 w-16 bg-white/20 rounded"></div>
                <div className="h-8 w-16 bg-white/20 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailLoading;
