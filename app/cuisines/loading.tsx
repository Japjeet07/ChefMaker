import React from "react";

const CuisinesLoading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
            🌍 World Cuisines
          </h1>
          <p className="text-xl text-gray-200 text-shadow">
            Loading delicious cuisines from around the globe...
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {[...Array(10)].map((_, idx) => (
            <div
              key={idx}
              className="glass-effect rounded-2xl p-8 animate-pulse"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-6xl mb-4 text-center opacity-50">🍽️</div>
              <div className="h-6 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-effect px-8 py-4 rounded-2xl inline-block animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisinesLoading;
