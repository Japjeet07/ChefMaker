"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import BlogList from "../../components/features/BlogList";
import { Blog } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { API_CONFIG } from "../../constants";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const BlogPage: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchBlogs = async (page: number = 1, append: boolean = false): Promise<void> => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const url = filter === 'following' 
        ? `${API_CONFIG.BASE_URL}/api/blogs/following?page=${page}&limit=10`
        : `${API_CONFIG.BASE_URL}/api/blogs?page=${page}&limit=10`;
      
      const res = await fetch(url, {
        cache: 'no-store',
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const response = await res.json();
      
      if (append) {
        setBlogs(prev => [...prev, ...(response.data || [])]);
      } else {
        setBlogs(response.data || []);
      }
      
      setCurrentPage(page);
      setTotalPages(response.pagination?.pages || 0);
      setHasMore(page < (response.pagination?.pages || 0));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      if (!append) {
        setBlogs([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchBlogs(1, false);
  }, [filter, user]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBlogs(currentPage + 1, true);
    }
  };

  // Set up infinite scrolling
  useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
    threshold: 300 // Load more when 300px from bottom
  });
  
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
              <div className="text-4xl mb-4 animate-spin">⏳</div>
              <p className="text-white text-xl">Loading blogs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header with Add Blog Button */}
          <div className="flex justify-between items-center mb-8 animate-fade-in-up">
            <div className="text-center flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
                📝 Recipe Blog
              </h1>
              <p className="text-xl text-gray-200 text-shadow">
                Share your culinary adventures and discover amazing food stories
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/blog/new"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift inline-flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Add Blog</span>
              </Link>
            </div>
          </div>

          {/* Filter Options */}
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-effect p-4 rounded-2xl max-w-md mx-auto">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : 'bg-white/20 text-gray-200 hover:bg-white/30'
                  }`}
                >
                  All Blogs
                </button>
                <button
                  onClick={() => setFilter('following')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    filter === 'following'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : 'bg-white/20 text-gray-200 hover:bg-white/30'
                  }`}
                >
                  Following
                </button>
              </div>
            </div>
          </div>

          {/* Blog List */}
          {blogs.length > 0 ? (
            <>
              <BlogList blogs={blogs} />
              
              {/* Infinite Scroll Loading Indicator */}
              {loadingMore && (
                <div className="text-center mt-8 animate-fade-in-up">
                  <div className="glass-effect p-6 rounded-2xl max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin text-2xl">⏳</div>
                      <span className="text-white text-lg">Loading more blogs...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* End of content indicator */}
              {!hasMore && blogs.length > 0 && (
                <div className="text-center mt-8 animate-fade-in-up">
                  <div className="glass-effect p-4 rounded-2xl max-w-md mx-auto">
                    <p className="text-gray-300 text-sm">
                      🎉 You've reached the end! No more blogs to load.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">📝</div>
                <h2 className="text-2xl font-bold text-white mb-4">No blog posts yet</h2>
                <p className="text-gray-300 mb-6">
                  Be the first to share your culinary story!
                </p>
                <Link
                  href="/blog/new"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift"
                >
                  ✨ Create First Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BlogPage;
