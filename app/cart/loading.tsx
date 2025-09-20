import React from "react";

const CartLoading = (): React.JSX.Element => {
  const placeholder = [...Array(3)];
  
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-16 bg-gray-300/20 rounded-lg mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-300/20 rounded-lg max-w-lg mx-auto"></div>
        </div>
        
        {/* Cart items skeleton */}
        <div className="space-y-6">
          {placeholder.map((_, idx) => (
            <div key={idx} className="glass-effect rounded-2xl p-6 animate-pulse">
              <div className="flex items-center space-x-6">
                {/* Recipe image skeleton */}
                <div className="w-24 h-24 bg-gray-300/20 rounded-lg flex-shrink-0"></div>
                
                {/* Recipe info skeleton */}
                <div className="flex-1">
                  <div className="h-6 bg-gray-300/20 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300/20 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-300/20 rounded w-1/3"></div>
                </div>
                
                {/* Quantity controls skeleton */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300/20 rounded"></div>
                  <div className="w-8 h-6 bg-gray-300/20 rounded"></div>
                  <div className="w-8 h-8 bg-gray-300/20 rounded"></div>
                </div>
                
                {/* Price skeleton */}
                <div className="w-20 h-6 bg-gray-300/20 rounded"></div>
                
                {/* Remove button skeleton */}
                <div className="w-8 h-8 bg-gray-300/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cart summary skeleton */}
        <div className="mt-8 glass-effect rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-300/20 rounded w-32"></div>
            <div className="h-6 bg-gray-300/20 rounded w-20"></div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-300/20 rounded w-24"></div>
            <div className="h-6 bg-gray-300/20 rounded w-16"></div>
          </div>
          <div className="h-12 bg-gray-300/20 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
