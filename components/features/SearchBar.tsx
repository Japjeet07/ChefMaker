"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBarProps } from "../../types";

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "🔍 Search for recipes, ingredients, or cuisines..." }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (searchTerm.trim() && !isSearching) {
      setIsSearching(true);
      onSearch?.(searchTerm.trim());
      try {
        await router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
      <div className="relative">
        <div className={`flex glass-effect rounded-2xl overflow-hidden transition-all duration-300 ${
          isFocused ? 'ring-2 ring-yellow-400 shadow-2xl' : 'shadow-lg'
        }`}>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isSearching}
              className={`w-full p-4 text-lg bg-transparent text-white placeholder-gray-300 focus:outline-none ${
                isSearching ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className={`px-8 py-4 font-bold transition-all duration-300 flex items-center space-x-2 ${
              isSearching 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover-lift'
            } text-white`}
          >
            <span className={isSearching ? 'animate-spin' : ''}>
              {isSearching ? '⏳' : '🚀'}
            </span>
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
        
        {/* Search suggestions */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-fade-in-up z-50">
            <div className="text-white text-sm mb-2">💡 Try searching for:</div>
            <div className="flex flex-wrap gap-2">
              {['pasta', 'chicken', 'vegetarian', 'dessert', 'quick meals'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSearchTerm(suggestion)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-white text-sm transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

