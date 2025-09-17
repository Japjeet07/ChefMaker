"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blog } from "../../types";
import SafeImage from "../ui/SafeImage";
import BlogInteraction from "./BlogInteraction";
import ShareBlog from "./ShareBlog";
import { useAuth } from "../../contexts/AuthContext";

interface BlogDetailProps {
  blog: Blog;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [currentBlog, setCurrentBlog] = useState<Blog>(blog);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (): Promise<void> => {
    if (!user || blog.author._id !== user._id) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isAuthor = user && blog.author._id === user._id;

  return (
    <div className="animate-fade-in-up">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300 hover-lift flex items-center space-x-2 w-fit"
        >
          <span>←</span>
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Main blog post */}
      <article className="glass-effect rounded-2xl overflow-visible">
        {/* Instagram-like header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {blog.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{blog.author.name}</h3>
              <p className="text-gray-400">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <ShareBlog blog={blog} />
            
            {isAuthor && (
              <>
                <Link
                  href={`/blog/${blog._id}/edit`}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors flex-shrink-0"
                  title="Edit post"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg text-white hover:bg-red-500/20 transition-colors flex-shrink-0"
                  title="Delete post"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{blog.title}</h1>
          
          {/* Media */}
          {(blog.image || blog.video) && (
            <div className="mb-6">
              {blog.image && (
                <SafeImage
                  src={blog.image}
                  alt={blog.title}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
              )}
              {blog.video && (
                <video
                  src={blog.video}
                  controls
                  className="w-full h-96 object-cover rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Text content */}
          <div className="text-gray-300 mb-6 whitespace-pre-wrap">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/10 text-pink-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

      </article>

      {/* Blog Interactions */}
      <div className="mt-6">
        <BlogInteraction 
          blog={currentBlog} 
          onUpdate={setCurrentBlog}
        />
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-effect p-8 rounded-2xl max-w-md w-full mx-4 animate-bounce-in">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-4">Delete Blog Post?</h3>
              <p className="text-gray-300 mb-6">
                This action cannot be undone. Your blog post will be permanently deleted.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 glass-effect rounded-lg text-white font-semibold transition-all duration-300 hover-lift"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isDeleting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600 hover-lift'
                  } text-white`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
