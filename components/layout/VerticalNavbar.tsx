'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/SocketContext';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '../../constants';

const VerticalNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { chats, currentChatId, isOnChatPage } = useChat();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('navbarCollapsed') === 'true';
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTotalUnreadCount = () => {
    if (!user || !chats) return 0;
    if (isOnChatPage) return 0;
    return chats.reduce((total, chat) => {
      return total + (chat.unreadCount[user._id] || 0);
    }, 0);
  };

  const totalUnreadCount = getTotalUnreadCount();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (totalUnreadCount > 0) {
      const vibrationInterval = setInterval(() => {
        const navbar = document.querySelector('.navbar-vibrate');
        if (navbar) {
          navbar.classList.remove('vibrate');
          (navbar as HTMLElement).offsetHeight;
          navbar.classList.add('vibrate');
          setTimeout(() => {
            navbar.classList.remove('vibrate');
          }, 500);
        }
      }, 5000);

      return () => clearInterval(vibrationInterval);
    }
  }, [totalUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.success ? data.data : []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('navbarCollapsed', newCollapsedState.toString());
      window.dispatchEvent(new CustomEvent('navbarToggle'));
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return null; // Don't show vertical navbar if user is not logged in
  }

  return (
    <>
      {/* Mobile Burger Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-[120] p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {totalUnreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[105]"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop/Mobile Navbar */}
      <div className={`navbar-vibrate fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-[110] flex flex-col ${
        isMobile 
          ? (isMobileMenuOpen ? 'w-64' : 'w-0 overflow-hidden')
          : (isCollapsed ? 'w-16' : 'w-64')
      }`}>
      {/* Desktop Collapse Toggle Button */}
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors duration-300 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      )}

      {/* User Info */}
      <div className="pt-20 px-4 pb-6 flex-shrink-0">
        {(!isCollapsed || isMobile) && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
              {user.name?.charAt(0).toUpperCase() || '👤'}
            </div>
            <h3 className="text-white font-semibold text-lg">{user.name}</h3>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full ml-[-7] mb-3  flex items-center justify-center text-lg">
              {user.name?.charAt(0).toUpperCase() || '👤'}
            </div>
          </div>
        )}
      </div>

      {/* User Search Section */}
      {(!isCollapsed || isMobile) && (
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm"
            />
            {isSearching && (
              <div className="absolute right-2 top-2">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-1 bg-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
              {searchResults.map((result) => (
                <Link
                  key={result._id}
                  href={`/profile/${result._id}`}
                  className="flex items-center p-3 hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    {result.name?.charAt(0).toUpperCase() || '👤'}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{result.name}</div>
                    <div className="text-gray-400 text-xs">{result.email}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
        <Link 
          href="/search" 
          className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <span className="text-xl">🔍</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Search</span>}
        </Link>

        <Link 
          href="/recipes" 
          className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <span className="text-xl">🍳</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Recipes</span>}
        </Link>

        <Link 
          href="/blog" 
          className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <span className="text-xl">📝</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Blog</span>}
        </Link>

        <Link 
          href="/cuisines" 
          className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <span className="text-xl">🌍</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Cuisines</span>}
        </Link>

        <Link 
          href="/cart" 
          className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <span className="text-xl">🛒</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Cart</span>}
        </Link>

                <Link 
                  href={`/profile/${user._id}`} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white ${
                    (isCollapsed && !isMobile) ? 'justify-center' : ''
                  }`}
                  onClick={isMobile ? toggleMobileMenu : undefined}
                >
                  <span className="text-xl">👤</span>
                  {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">My Profile</span>}
                </Link>

                <Link 
                  href="/chat" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 text-white relative ${
                    (isCollapsed && !isMobile) ? 'justify-center' : ''
                  }`}
                  onClick={isMobile ? toggleMobileMenu : undefined}
                >
                  <span className="text-xl">💬</span>
                  {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Chat</span>}
                  
                  {totalUnreadCount > 0 && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                </Link>
      </nav>

      {/* Logout Button */}
      <div className="px-4 pb-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 text-white ${
            (isCollapsed && !isMobile) ? 'justify-center' : ''
          }`}
        >
          <span className="text-xl">🚪</span>
          {(!isCollapsed || isMobile) && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-4 w-1 h-1 bg-orange-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"></div>
      </div>
    </div>
    </>
  );
};

export default VerticalNavbar;
