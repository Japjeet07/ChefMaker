import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="glass-effect p-8 rounded-2xl text-center animate-bounce-in">
        <div className="text-6xl mb-4 animate-spin">⏳</div>
        <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
        <p className="text-gray-200">Please wait while we fetch your recipes</p>
      </div>
    </div>
  );
};

