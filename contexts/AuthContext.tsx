"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, UserWithoutPassword } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showLogoutAnimation, setShowLogoutAnimation] = useState<boolean>(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: UserWithoutPassword, token: string, redirectCallback?: () => void): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuthModal(false);
    setShowWelcomeAnimation(true);
    
    // Execute redirect callback if provided
    if (redirectCallback) {
      redirectCallback();
    }
  };

  const logout = (): void => {
    setShowLogoutAnimation(true);
  };

  const completeLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutAnimation(false);
  };

  const completeWelcome = (): void => {
    setShowWelcomeAnimation(false);
  };

  const requireAuth = (callback: () => void): boolean => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    callback();
    return true;
  };

  const value: AuthContextType = {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    isLogin,
    setIsLogin,
    login,
    logout,
    requireAuth,
    showLogoutAnimation,
    completeLogout,
    showWelcomeAnimation,
    completeWelcome
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
