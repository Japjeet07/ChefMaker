import React from "react";

const BlogLoading = (): React.JSX.Element => {
  const placeholder = [...Array(6)];
  
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-16 bg-gray-300/20 rounded-lg mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-300/20 rounded-lg max-w-lg mx-auto"></div>
        </div>
        
        {/* Filter buttons skeleton */}
        <div className="flex justify-center mb-8 gap-4">
          <div className="h-10 w-24 bg-gray-300/20 rounded-full animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-300/20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Blog cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholder.map((_, idx) => (
            <div key={idx} className="glass-effect rounded-2xl p-6 animate-pulse">
              {/* Author info skeleton */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-300/20 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300/20 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300/20 rounded w-16"></div>
                </div>
              </div>
              
              {/* Title skeleton */}
              <div className="h-6 bg-gray-300/20 rounded mb-3"></div>
              <div className="h-6 bg-gray-300/20 rounded w-3/4 mb-4"></div>
              
              {/* Content skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300/20 rounded"></div>
                <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300/20 rounded w-4/6"></div>
              </div>
              
              {/* Actions skeleton */}
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="h-8 w-16 bg-gray-300/20 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300/20 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-300/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogLoading;
