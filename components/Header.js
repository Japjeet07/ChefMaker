"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const pathname = usePathname().replace("/", "");
  const currentArea = pathname.split("/")[1];
  const recipeID = pathname.split("/")[2];
  const { user, showAuthModal, setShowAuthModal, isLogin, setIsLogin, logout } = useAuth();

  const emojis = ['🍳', '👨‍🍳', '🥘', '🍽️', '👩‍🍳', '🍴', '🥄', '🍲', '🥗', '🍕', '🍝', '🍜'];
  const [currentEmoji, setCurrentEmoji] = useState(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="py-4 px-2 sm:px-10 glass-effect-dark sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/" className="group">
              <div className="flex items-center space-x-3">
                <span className="text-4xl animate-emoji-bounce group-hover:scale-110 transition-transform duration-300">
                  {currentEmoji}
                </span>
                <h1 className="text-white font-bold text-3xl sm:text-4xl text-shadow group-hover:text-yellow-300 transition-colors duration-300">
                  FoodieHub
                </h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="glass-effect px-4 py-2 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all duration-300 hover-lift"
            >
              🔍 Search
            </Link>
            
            <Link
              href="/types"
              className="glass-effect px-4 py-2 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all duration-300 hover-lift"
            >
              🍽️ Browse
            </Link>
            
            <Link
              href="/cart"
              className="glass-effect px-4 py-2 rounded-full text-white hover:bg-white hover:text-gray-800 transition-all duration-300 hover-lift"
            >
              🛒 Cart
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">Welcome, {user?.name}!</span>
                <button
                  onClick={logout}
                  className="glass-effect px-4 py-2 rounded-full text-white hover:bg-red-500 transition-all duration-300 hover-lift"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="glass-effect px-4 py-2 rounded-full text-white hover:bg-green-500 transition-all duration-300 hover-lift animate-pulse-glow"
              >
                🚀 Join Us
              </button>
            )}

            {pathname && currentArea && (
              <Link
                className="glass-effect px-4 py-2 rounded-full text-white hover:bg-blue-500 transition-all duration-300 hover-lift"
                href={recipeID ? `/types/${currentArea}` : "/types"}
              >
                ← Back to {recipeID ? `${currentArea} recipes` : "recipe types"}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-8 max-w-md w-full animate-bounce-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back! 🎉' : 'Join FoodieHub! 🚀'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-white hover:text-red-400 text-2xl"
              >
                ×
              </button>
            </div>

            <AuthForm 
              isLogin={isLogin} 
              onSuccess={() => {
                setShowAuthModal(false);
              }}
            />

            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-yellow-300 transition-colors duration-300"
              >
                {isLogin ? "Don't have an account? Sign up!" : "Already have an account? Sign in!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AuthForm = ({ isLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        onSuccess();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      )}
      
      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        className="w-full p-3 rounded-lg glass-effect text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover-lift disabled:opacity-50"
      >
        {loading ? '⏳ Processing...' : (isLogin ? '🎉 Sign In' : '🚀 Sign Up')}
      </button>
    </form>
  );
};

export default Header;
