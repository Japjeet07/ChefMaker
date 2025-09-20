'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isHomepage = pathname === '/';
  const shouldShowVerticalNav = !isHomepage && user;
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem('navbarCollapsed') === 'true';
      setIsNavbarCollapsed(collapsed);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('navbarToggle', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('navbarToggle', handleStorageChange);
    };
  }, []);

  const getMarginClass = () => {
    if (isHomepage) return '';
    if (!shouldShowVerticalNav) return '';
    if (isMobile) return 'ml-0'; // No margin on mobile
    return isNavbarCollapsed ? 'ml-16' : 'ml-64';
  };

  return (
    <div className={`transition-all duration-300 ${getMarginClass()}`}>
      {children}
    </div>
  );
};

export default ContentWrapper;
