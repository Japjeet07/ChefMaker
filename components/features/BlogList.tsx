"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Blog } from "../../types";
import SafeImage from "../ui/SafeImage";
import { useAuth } from "../../contexts/AuthContext";

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const { user } = useAuth();
  const [likingBlogs, setLikingBlogs] = useState<Set<string>>(new Set());
  const [blogStates, setBlogStates] = useState<Map<string, Blog>>(new Map());
  const [commentingBlogs, setCommentingBlogs] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Map<string, string>>(new Map());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string): string => {
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  };

  const getCurrentBlog = (blog: Blog): Blog => {
    return blogStates.get(blog._id) || blog;
  };

  const isLiked = (blog: Blog): boolean => {
    const currentBlog = getCurrentBlog(blog);
    return user && currentBlog.likes?.some(like => like.user === user._id) || false;
  };

  const handleLike = async (blog: Blog): Promise<void> => {
    if (!user || likingBlogs.has(blog._id)) return;

    setLikingBlogs(prev => new Set(prev).add(blog._id));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blogs/${blog._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const currentBlog = getCurrentBlog(blog);
        const updatedBlog = {
          ...currentBlog,
          likes: isLiked(currentBlog)
            ? (currentBlog.likes || []).filter(like => like.user !== user._id)
            : [...(currentBlog.likes || []), { user: user._id, createdAt: new Date().toISOString() }],
          likesCount: data.data.likesCount
        };
        setBlogStates(prev => new Map(prev).set(blog._id, updatedBlog));
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setLikingBlogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(blog._id);
        return newSet;
      });
    }
  };

  const handleComment = async (blog: Blog): Promise<void> => {
    const commentText = newComments.get(blog._id);
    if (!user || !commentText?.trim() || commentingBlogs.has(blog._id)) return;

    setCommentingBlogs(prev => new Set(prev).add(blog._id));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const currentBlog = getCurrentBlog(blog);
        const updatedBlog = {
          ...currentBlog,
          comments: [...(currentBlog.comments || []), data.data],
          commentsCount: (currentBlog.commentsCount || 0) + 1
        };
        setBlogStates(prev => new Map(prev).set(blog._id, updatedBlog));
        setNewComments(prev => {
          const newMap = new Map(prev);
          newMap.delete(blog._id);
          return newMap;
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentingBlogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(blog._id);
        return newSet;
      });
    }
  };

  const toggleComments = (blogId: string): void => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {blogs.map((blog, index) => (
        <div key={blog._id}>
          <article
            className="glass-effect rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
          {/* Instagram-like header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {blog.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{blog.author.name}</h3>
                <p className="text-gray-400 text-sm">{formatDate(blog.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">
                {blog.tags.slice(0, 2).map(tag => `#${tag}`).join(' ')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-3">{blog.title}</h2>
            
            {/* Media */}
            {(blog.image || blog.video) && (
              <div className="mb-4">
                {blog.image && (
                  <SafeImage
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                {blog.video && (
                  <video
                    src={blog.video}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            {/* Text content */}
            <div className="text-gray-300 mb-4">
              <p>{truncateText(blog.content)}</p>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-white/10 text-pink-300 px-2 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Instagram-like footer */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(blog)}
                  disabled={!user || likingBlogs.has(blog._id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 ${
                    isLiked(blog)
                      ? 'text-pink-500 bg-pink-500/30'
                      : 'text-white bg-pink-500/20 hover:bg-pink-500/30'
                  } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-xl">{isLiked(blog) ? '❤️' : '🤍'}</span>
                  <span className="text-sm font-semibold">{getCurrentBlog(blog).likesCount || 0}</span>
                </button>
                <button
                  onClick={() => toggleComments(blog._id)}
                  className="flex items-center space-x-2 text-white bg-blue-500/20 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-xl">💬</span>
                  <span className="text-sm font-semibold">{getCurrentBlog(blog).commentsCount || 0}</span>
                </button>
              </div>
              
              <Link
                href={`/blog/${blog._id}`}
                className="text-pink-400 hover:text-pink-300 transition-colors text-sm font-medium"
              >
                Read more →
              </Link>
            </div>
          </div>
          </article>

          {/* Comments Section */}
          {showComments.has(blog._id) && (
            <div className="glass-effect rounded-2xl p-4 mt-4 animate-fade-in-up">
              <h4 className="text-white text-lg font-bold mb-4">Comments</h4>
              
              {/* Comments List */}
              <div className="space-y-3 mb-4">
                {(getCurrentBlog(blog).comments || []).length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  (getCurrentBlog(blog).comments || []).map((comment: any) => (
                    <div key={comment._id} className="border-b border-white/10 pb-3 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-semibold text-sm">{comment.user.name}</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              {user && (
                <div className="border-t border-white/10 pt-4">
                  <textarea
                    value={newComments.get(blog._id) || ''}
                    onChange={(e) => setNewComments(prev => new Map(prev).set(blog._id, e.target.value))}
                    placeholder="Share your thoughts about this post..."
                    className="w-full p-3 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none text-sm"
                    rows={2}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs">{(newComments.get(blog._id) || '').length}/500</span>
                    <button
                      onClick={() => handleComment(blog)}
                      disabled={!newComments.get(blog._id)?.trim() || commentingBlogs.has(blog._id)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        !newComments.get(blog._id)?.trim() || commentingBlogs.has(blog._id)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover-lift'
                      } text-white`}
                    >
                      {commentingBlogs.has(blog._id) ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
