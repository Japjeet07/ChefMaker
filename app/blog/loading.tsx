import React from "react";

const BlogLoading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
            📝 Recipe Blog
          </h1>
          <div className="glass-effect p-4 rounded-2xl max-w-md mx-auto animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mx-auto"></div>
          </div>
        </div>

        {/* Blog posts skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl overflow-hidden animate-pulse"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header skeleton */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-white/20 rounded w-20"></div>
              </div>

              {/* Content skeleton */}
              <div className="p-6">
                <div className="h-8 bg-white/20 rounded mb-4 w-3/4"></div>
                <div className="h-48 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2 w-full"></div>
                <div className="h-4 bg-white/20 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>

              {/* Footer skeleton */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="h-4 bg-white/20 rounded w-8"></div>
                    <div className="h-4 bg-white/20 rounded w-8"></div>
                  </div>
                  <div className="h-4 bg-white/20 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogLoading;
