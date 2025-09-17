"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/layout/ProtectedRoute';
import SimpleTextEditor from '../../../../components/ui/SimpleTextEditor';
import { useAuth } from '../../../../contexts/AuthContext';
import { BlogFormData, Blog } from '../../../../types';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditBlogPage: React.FC<EditBlogPageProps> = ({ params }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    image: '',
    video: '',
    tags: '',
    isPublic: true
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const resolvedParams = await params;
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/blogs/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const blogData = data.data;
          
          // Check if user is the author
          if (user && blogData.author._id !== user._id) {
            router.push('/blog');
            return;
          }

          setBlog(blogData);
          setFormData({
            title: blogData.title,
            content: blogData.content,
            image: blogData.image || '',
            video: blogData.video || '',
            tags: blogData.tags.join(', '),
            isPublic: blogData.isPublic
          });
        } else {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlog();
    }
  }, [user, params, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentChange = (content: string): void => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setSaving(true);
    
    try {
      const resolvedParams = await params;
      const token = localStorage.getItem('token');
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch(`/api/blogs/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          image: formData.image || undefined,
          video: formData.video || undefined,
          tags,
          isPublic: formData.isPublic
        })
      });

      if (response.ok) {
        router.push(`/blog/${resolvedParams.id}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="glass-effect p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-white text-xl">Loading blog post...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!blog) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="glass-effect p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-white text-xl">Blog post not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
              ✏️ Edit Post
            </h1>
            <p className="text-xl text-gray-200 text-shadow">
              Update your culinary story
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Title */}
            <div className="glass-effect p-6 rounded-2xl">
              <label className="block text-white text-lg font-semibold mb-3">
                📝 Post Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your post an engaging title..."
                className="w-full p-4 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                required
              />
            </div>

            {/* Content */}
            <div className="glass-effect p-6 rounded-2xl">
              <label className="block text-white text-lg font-semibold mb-3">
                📖 Post Content
              </label>
              <SimpleTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Tell your story... Share your recipe, cooking tips, or culinary adventures!"
                className="min-h-[300px]"
              />
            </div>

            {/* Media */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect p-6 rounded-2xl">
                <label className="block text-white text-lg font-semibold mb-3">
                  🖼️ Featured Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-4 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div className="glass-effect p-6 rounded-2xl">
                <label className="block text-white text-lg font-semibold mb-3">
                  🎥 Video URL (Optional)
                </label>
                <input
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full p-4 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="glass-effect p-6 rounded-2xl">
              <label className="block text-white text-lg font-semibold mb-3">
                🏷️ Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="cooking, recipe, italian, dessert (comma separated)"
                className="w-full p-4 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
              <p className="text-gray-400 text-sm mt-2">
                Separate tags with commas to help others discover your post
              </p>
            </div>

            {/* Privacy */}
            <div className="glass-effect p-6 rounded-2xl">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-pink-500 bg-transparent border-2 border-white/30 rounded focus:ring-pink-400 focus:ring-2"
                />
                <span className="text-white text-lg font-semibold">
                  🌍 Make this post public
                </span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Public posts can be seen by everyone. Uncheck to keep it private.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 glass-effect rounded-full text-white font-semibold transition-all duration-300 hover-lift"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  saving 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover-lift'
                } text-white`}
              >
                {saving ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin">⏳</span>
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>💾</span>
                    <span>Save Changes</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditBlogPage;
