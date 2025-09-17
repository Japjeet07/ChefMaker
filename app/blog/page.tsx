"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import BlogList from "../../components/features/BlogList";
import { Blog } from "../../types";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async (): Promise<void> => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chefmaker.onrender.com' : 'http://localhost:3000');
        const res = await fetch(`${baseUrl}/api/blogs?limit=20`, {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const response = await res.json();
        setBlogs(response.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
              📝 Recipe Blog
            </h1>
            <p className="text-xl text-gray-200 text-shadow mb-6">
              Share your culinary adventures and discover amazing food stories
            </p>
            <Link
              href="/blog/new"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover-lift inline-flex items-center space-x-2"
            >
              <span>✨</span>
              <span>Create New Post</span>
            </Link>
          </div>

          {/* Blog List */}
          {blogs.length > 0 ? (
            <BlogList blogs={blogs} />
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
