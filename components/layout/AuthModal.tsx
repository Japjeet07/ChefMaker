"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "../../constants";

const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, isLogin, setIsLogin, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const toggleAuthMode = (): void => {
    setIsLogin(!isLogin);
    setError('');
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const closeAuthModal = (): void => {
    setShowAuthModal(false);
    setError('');
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isLogin ? API_CONFIG.ENDPOINTS.AUTH.LOGIN : API_CONFIG.ENDPOINTS.AUTH.REGISTER;
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(isLogin ? {} : { name }),
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        // Redirect to search page after successful login
        router.push('/search');
        setError('');
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={closeAuthModal}
    >
      <div 
        className="glass-effect p-6 rounded-2xl w-full max-w-sm mx-auto animate-bounce-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? '🚀 Welcome Back!' : '✨ Join Us!'}
          </h2>
          <p className="text-gray-300 text-sm">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
          {error && (
            <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={handleAuthSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label className="block text-white text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                required={!isLogin}
                className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-white text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-white text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 text-sm ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover-lift'
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <span className="animate-spin">⏳</span>
                <span>{isLogin ? 'Signing In...' : 'Signing Up...'}</span>
              </span>
            ) : (
              <span>{isLogin ? '🚀 Sign In' : '✨ Sign Up'}</span>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            onClick={toggleAuthMode}
            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-xs"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-300 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
