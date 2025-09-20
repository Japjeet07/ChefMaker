'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const HomepageNavbar: React.FC = () => {
  const { user, setShowAuthModal } = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    if (user) {
      // If user is logged in, redirect to search page
      router.push('/search');
    } else {
      // If user is not logged in, open auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">👨‍🍳</div>
            <span className="text-white font-bold text-xl">ChefMaker</span>
          </Link>

          {/* User Status & Action */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-white">
                  Welcome, <span className="font-semibold text-yellow-400">{user.name}</span>!
                </div>
                <button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  🔍 Start Cooking
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                🚀 Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomepageNavbar;
