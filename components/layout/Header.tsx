"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const pathname = usePathname().replace("/", "");
  const currentArea = pathname.split("/")[1];
  const recipeID = pathname.split("/")[2];
  const { user, setShowAuthModal, logout } = useAuth();

  const emojis: string[] = ['🍳', '👨‍🍳', '🥘', '🍽️', '👩‍🍳', '🍴', '🥄', '🍲', '🥗', '🍕', '🍝', '🍜'];
  const [currentEmoji, setCurrentEmoji] = useState<string>(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = (): void => {
    logout();
  };

  const openAuthModal = (): void => {
    setShowAuthModal(true);
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" prefetch={true} className="flex items-center space-x-3 group">
            <div className="text-3xl animate-emoji-bounce group-hover:scale-110 transition-transform duration-300">
              {currentEmoji}
            </div>
            <div className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
              Recipe Finder
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/search" 
              prefetch={true}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentArea === 'search' 
                  ? 'bg-yellow-400 text-black font-semibold' 
                  : 'text-white hover:bg-white/20 hover:text-yellow-400'
              }`}
            >
              🔍 Search
            </Link>
            
            <Link 
              href="/cuisines" 
              prefetch={true}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentArea === 'cuisines' 
                  ? 'bg-yellow-400 text-black font-semibold' 
                  : 'text-white hover:bg-white/20 hover:text-yellow-400'
              }`}
            >
              🍽️ Browse
            </Link>
            
            <Link 
              href="/blog" 
              prefetch={true}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentArea === 'blog' 
                  ? 'bg-pink-400 text-black font-semibold' 
                  : 'text-white hover:bg-white/20 hover:text-pink-400'
              }`}
            >
              📝 Blog
            </Link>

            {user && (
              <Link 
                href="/cart" 
                prefetch={true}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  currentArea === 'cart' 
                    ? 'bg-yellow-400 text-black font-semibold' 
                    : 'text-white hover:bg-white/20 hover:text-yellow-400'
                }`}
              >
                🛒 Cart
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  Welcome, <span className="font-semibold text-yellow-400">{user.name}</span>!
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover-lift"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover-lift"
              >
                🚀 Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;

