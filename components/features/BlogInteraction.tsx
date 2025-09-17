"use client";

import React, { useState } from "react";
import { Blog, BlogComment } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface BlogInteractionProps {
  blog: Blog;
  onUpdate: (updatedBlog: Blog) => void;
}

const BlogInteraction: React.FC<BlogInteractionProps> = ({ blog, onUpdate }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  const isLiked = user && blog.likes?.some(like => like.user === user._id);

  const handleLike = async (): Promise<void> => {
    if (!user || isLiking) return;

    setIsLiking(true);
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
        const updatedBlog = {
          ...blog,
          likes: isLiked 
            ? (blog.likes || []).filter(like => like.user !== user._id)
            : [...(blog.likes || []), { user: user._id, createdAt: new Date().toISOString() }],
          likesCount: data.data.likesCount
        };
        onUpdate(updatedBlog);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (): Promise<void> => {
    if (!user || !newComment.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedBlog = {
          ...blog,
          comments: [...(blog.comments || []), data.data],
          commentsCount: (blog.commentsCount || 0) + 1
        };
        onUpdate(updatedBlog);
        setNewComment("");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Like and Comment Section */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-pink-500' 
                  : 'text-white hover:text-pink-400'
              } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-semibold">{blog.likesCount || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              <span className="text-2xl">💬</span>
              <span className="font-semibold">{blog.commentsCount || 0}</span>
            </button>
          </div>

          <div className="text-gray-400 text-sm">
            {blog.isPublic ? '🌍 Public' : '🔒 Private'}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-white text-xl font-bold mb-4">Comments</h3>
          
          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {(blog.comments || []).length === 0 ? (
              <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              (blog.comments || []).map((comment: BlogComment) => (
                <div key={comment._id} className="border-b border-white/10 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-semibold">{comment.user.name}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment - Now at the bottom */}
          {user && (
            <div className="border-t border-white/10 pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this post..."
                className="w-full p-3 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">{newComment.length}/500</span>
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim() || isCommenting}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    !newComment.trim() || isCommenting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover-lift'
                  } text-white`}
                >
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogInteraction;
