import React from "react";

const CuisinesTypeLoading = (): React.JSX.Element => {
  const placeholder = [...Array(8)];
  
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8 text-center animate-pulse">
          <div className="h-16 bg-gray-300/20 rounded-lg mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-300/20 rounded-lg max-w-lg mx-auto"></div>
        </div>
        
        {/* Recipe cards skeleton */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {placeholder.map((_, idx) => (
            <div key={idx} className="glass-effect rounded-2xl overflow-hidden animate-pulse">
              {/* Recipe image skeleton */}
              <div className="w-full h-48 bg-gray-300/20 relative">
                <div className="absolute top-4 right-4 w-16 h-6 bg-gray-300/20 rounded-full"></div>
              </div>
              
              <div className="p-6">
                {/* Cuisine and time skeleton */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-20 h-6 bg-gray-300/20 rounded-full"></div>
                  <div className="w-16 h-4 bg-gray-300/20 rounded"></div>
                </div>
                
                {/* Recipe title skeleton */}
                <div className="h-6 bg-gray-300/20 rounded mb-2"></div>
                <div className="h-6 bg-gray-300/20 rounded w-3/4 mb-4"></div>
                
                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-300/20 rounded"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
                </div>
                
                {/* Servings and author skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-20 h-4 bg-gray-300/20 rounded"></div>
                  <div className="w-24 h-4 bg-gray-300/20 rounded"></div>
                </div>
                
                {/* Tags skeleton */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <div className="w-12 h-6 bg-gray-300/20 rounded-full"></div>
                  <div className="w-16 h-6 bg-gray-300/20 rounded-full"></div>
                  <div className="w-14 h-6 bg-gray-300/20 rounded-full"></div>
                </div>
                
                {/* Interaction counts skeleton */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-6 bg-gray-300/20 rounded-full"></div>
                  <div className="w-12 h-6 bg-gray-300/20 rounded-full"></div>
                  <div className="w-16 h-6 bg-gray-300/20 rounded-full"></div>
                </div>
                
                {/* Action buttons skeleton */}
                <div className="flex space-x-3">
                  <div className="flex-1 h-10 bg-gray-300/20 rounded-lg"></div>
                  <div className="w-12 h-10 bg-gray-300/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuisinesTypeLoading;
