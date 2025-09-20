import React from "react";

const CuisinesLoading = (): React.JSX.Element => {
  const placeholder = [...Array(15)];
  
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-16 bg-gray-300/20 rounded-lg mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-300/20 rounded-lg max-w-lg mx-auto"></div>
        </div>
        
        {/* Cuisine cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {placeholder.map((_, idx) => (
            <div key={idx} className="glass-effect rounded-2xl p-8 animate-pulse">
              {/* Emoji skeleton */}
              <div className="w-16 h-16 bg-gray-300/20 rounded-full mx-auto mb-4"></div>
              
              {/* Cuisine name skeleton */}
              <div className="h-6 bg-gray-300/20 rounded mb-2 w-3/4 mx-auto"></div>
              
              {/* Explore text skeleton */}
              <div className="h-4 bg-gray-300/20 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom section skeleton */}
        <div className="text-center">
          <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto animate-pulse">
            <div className="w-16 h-16 bg-gray-300/20 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300/20 rounded mb-4 w-3/4 mx-auto"></div>
            <div className="h-10 bg-gray-300/20 rounded-lg w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisinesLoading;
