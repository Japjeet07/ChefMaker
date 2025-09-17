import React from "react";

const CartLoading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-6">
            🛒 Your Cart
          </h1>
          <div className="glass-effect p-4 rounded-2xl max-w-md mx-auto animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mx-auto"></div>
          </div>
        </div>

        {/* Cart items skeleton */}
        <div className="grid gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-6 animate-pulse"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 rounded-lg"></div>
                </div>
                
                <div className="flex-1">
                  <div className="h-6 bg-white/20 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded mb-2 w-full"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-white/20 rounded w-20"></div>
                    <div className="h-4 bg-white/20 rounded w-16"></div>
                    <div className="h-4 bg-white/20 rounded w-24"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="h-4 bg-white/20 rounded w-16 mb-2"></div>
                    <div className="h-8 bg-white/20 rounded w-8"></div>
                  </div>
                  
                  <div className="h-10 bg-white/20 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
