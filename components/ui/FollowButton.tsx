'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG } from '../../constants';
import { UserWithoutPassword } from '../../types';

interface FollowButtonProps {
  userId: string;
  userName: string;
  isFollowing: boolean;
  followersCount: number;
  onFollowChange?: (isFollowing: boolean, newCount: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  userName,
  isFollowing,
  followersCount,
  onFollowChange,
  size = 'md',
  className = ''
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentIsFollowing, setCurrentIsFollowing] = useState(isFollowing);
  const [currentFollowersCount, setCurrentFollowersCount] = useState(followersCount);

  const handleFollow = async () => {
    if (!user) {
      // Redirect to login or show auth modal
      window.location.href = '/';
      return;
    }

    if (user._id === userId) {
      return; // Can't follow yourself
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = currentIsFollowing ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/${userId}/follow`,
        {
          method: endpoint,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const newIsFollowing = !currentIsFollowing;
        const newCount = currentIsFollowing ? currentFollowersCount - 1 : currentFollowersCount + 1;
        
        setCurrentIsFollowing(newIsFollowing);
        setCurrentFollowersCount(newCount);
        
        if (onFollowChange) {
          onFollowChange(newIsFollowing, newCount);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      alert('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user._id === userId) {
    return null; // Don't show follow button for own profile or when not logged in
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`${getSizeClasses()} rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        currentIsFollowing
          ? 'bg-gray-500 hover:bg-gray-600 text-white'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
      } ${className}`}
    >
      {loading ? '...' : currentIsFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
