'use client';

import React from 'react';
import Link from 'next/link';
import { UserWithoutPassword } from '../../types';

interface UserNameProps {
  user: UserWithoutPassword | string | null | undefined;
  className?: string;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
}

const UserName: React.FC<UserNameProps> = ({ 
  user, 
  className = '', 
  showAvatar = false,
  avatarSize = 'sm'
}) => {
  // Handle null/undefined user
  if (!user) {
    return <span className={className}>Unknown User</span>;
  }

  // Handle both string and object user types
  const userId = typeof user === 'string' ? user : user._id;
  const userName = typeof user === 'string' ? user : user.name;
  const userAvatar = typeof user === 'string' ? null : user.avatar;

  const getAvatarSize = () => {
    switch (avatarSize) {
      case 'sm': return 'w-6 h-6';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (avatarSize) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      default: return 'text-sm';
    }
  };

  return (
    <Link 
      href={`/profile/${userId}`}
      className={`inline-flex items-center space-x-2 hover:text-blue-600 transition-colors duration-300 ${className}`}
    >
      {showAvatar && (
        <div className={`${getAvatarSize()} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={userName}
              className={`${getAvatarSize()} rounded-full object-cover`}
            />
          ) : (
            <span className={avatarSize === 'sm' ? 'text-xs' : avatarSize === 'md' ? 'text-sm' : 'text-base'}>
              {userName?.charAt(0).toUpperCase() || '👤'}
            </span>
          )}
        </div>
      )}
      <span className={`font-medium ${getTextSize()}`}>
        {userName}
      </span>
    </Link>
  );
};

export default UserName;
