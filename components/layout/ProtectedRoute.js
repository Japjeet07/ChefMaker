"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, fallback = null }) => {
  const { user, loading, setShowAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl text-center animate-bounce-in max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">
            Please log in to access this feature and explore all the amazing recipes!
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-green-500 transition-all duration-300 hover-lift"
          >
            🚀 Login Now
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

