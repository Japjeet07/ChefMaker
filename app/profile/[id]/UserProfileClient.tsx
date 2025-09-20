'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { API_CONFIG } from '../../../constants';
import { UserProfile, Recipe, Blog } from '../../../types';
import RecipeList from '../../../components/features/RecipeList';
import BlogList from '../../../components/features/BlogList';
import { createOrGetChat } from '../../../lib/chatService';
import toast from 'react-hot-toast';

interface UserProfileClientProps {
  userProfile: UserProfile;
  initialPosts: {
    recipes: Recipe[];
    blogs: Blog[];
  };
}

const UserProfileClient: React.FC<UserProfileClientProps> = ({ 
  userProfile, 
  initialPosts 
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(userProfile.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(userProfile.followersCount);
  const [activeTab, setActiveTab] = useState<'recipes' | 'blogs'>('recipes');
  const [loading, setLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const isOwnProfile = user && user._id === userProfile._id;

  const fetchFollowers = async () => {
    if (followersList.length > 0) {
      setShowFollowers(!showFollowers);
      return;
    }

    setLoadingLists(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userProfile._id}/followers`);
      if (response.ok) {
        const data = await response.json();
        setFollowersList(data.success ? data.data : []);
        setShowFollowers(true);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoadingLists(false);
    }
  };

  const fetchFollowing = async () => {
    if (followingList.length > 0) {
      setShowFollowing(!showFollowing);
      return;
    }

    setLoadingLists(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userProfile._id}/following`);
      if (response.ok) {
        const data = await response.json();
        setFollowingList(data.success ? data.data : []);
        setShowFollowing(true);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = isFollowing ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/users/${userProfile._id}/follow`,
        {
          method: endpoint,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
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

  const handleStartChat = async () => {
    if (!user) return;

    setChatLoading(true);
    try {
      const chatId = await createOrGetChat(user._id, userProfile._id, user.name, userProfile.name);
      router.push(`/chat?chatId=${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="glass-effect p-8 rounded-2xl animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {userProfile.name?.charAt(0).toUpperCase() || '👤'}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
              {userProfile.bio && (
                <p className="text-gray-200 mb-4 max-w-md">{userProfile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userProfile.recipesCount}</div>
                  <div className="text-sm text-gray-200">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userProfile.blogsCount}</div>
                  <div className="text-sm text-gray-200">Blogs</div>
                </div>
                <div className="text-center">
                  <button
                    onClick={fetchFollowers}
                    className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                    disabled={loadingLists}
                  >
                    {followersCount}
                  </button>
                  <div className="text-sm text-gray-200">Followers</div>
                </div>
                <div className="text-center">
                  <button
                    onClick={fetchFollowing}
                    className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                    disabled={loadingLists}
                  >
                    {userProfile.followingCount}
                  </button>
                  <div className="text-sm text-gray-200">Following</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center md:justify-start space-x-4">
                {isOwnProfile ? (
                  <Link
                    href="/profile/edit"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Edit Profile
                  </Link>
                ) : user ? (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={loading}
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        isFollowing
                          ? 'bg-gray-500 hover:bg-gray-600 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                      }`}
                    >
                      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={handleStartChat}
                      disabled={chatLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chatLoading ? '⏳' : '💬'} Chat
                    </button>
                  </>
                ) : (
                  <Link
                    href="/"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Login to Follow
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="glass-effect p-6 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex space-x-8 border-b border-white/20">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-2 font-semibold transition-colors duration-300 ${
                activeTab === 'recipes'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-200 hover:text-yellow-400'
              }`}
            >
              Recipes ({userProfile.recipesCount})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`pb-2 font-semibold transition-colors duration-300 ${
                activeTab === 'blogs'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-200 hover:text-yellow-400'
              }`}
            >
              Blogs ({userProfile.blogsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'recipes' ? (
          <RecipeList recipes={initialPosts.recipes} />
        ) : (
          <BlogList blogs={initialPosts.blogs} />
        )}
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect p-6 rounded-2xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Followers</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loadingLists ? (
                <div className="text-center py-4">
                  <div className="text-white">Loading...</div>
                </div>
              ) : followersList.length > 0 ? (
                <div className="space-y-3">
                  {followersList.map((follower) => (
                    <Link
                      key={follower._id}
                      href={`/profile/${follower._id}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={() => setShowFollowers(false)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {follower.name?.charAt(0).toUpperCase() || '👤'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{follower.name}</div>
                        <div className="text-gray-400 text-sm">{follower.email}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">No followers yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect p-6 rounded-2xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Following</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loadingLists ? (
                <div className="text-center py-4">
                  <div className="text-white">Loading...</div>
                </div>
              ) : followingList.length > 0 ? (
                <div className="space-y-3">
                  {followingList.map((following) => (
                    <Link
                      key={following._id}
                      href={`/profile/${following._id}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={() => setShowFollowing(false)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {following.name?.charAt(0).toUpperCase() || '👤'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{following.name}</div>
                        <div className="text-gray-400 text-sm">{following.email}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">Not following anyone yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileClient;
