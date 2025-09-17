import React from "react";

const SearchLoading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-6">
            🔍 Search Recipes
          </h1>
          {/* Search bar skeleton */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-effect rounded-2xl p-4 animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Loading skeleton for search results */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-effect p-6 rounded-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-4xl animate-spin">⏳</div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Searching...</h2>
                <p className="text-gray-300">Finding the best recipes for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="glass-effect rounded-2xl p-6 animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-full h-48 bg-white/20 rounded-lg mb-4"></div>
              <div className="h-6 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
