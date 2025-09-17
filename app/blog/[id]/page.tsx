import React from "react";
import Link from "next/link";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import BlogDetail from "../../../components/features/BlogDetail";

const fetchBlog = async (id: string): Promise<any | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chefmaker.onrender.com' : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch blog');
    }
    
    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
};

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps): Promise<React.JSX.Element> => {
  const { id } = await params;
  const blog = await fetchBlog(id);

  if (!blog) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="glass-effect p-8 rounded-2xl text-center animate-bounce-in">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-3xl font-bold text-white mb-4">Blog post not found</h1>
            <Link
              href="/blog"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-4xl mx-auto">
          <BlogDetail blog={blog} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BlogDetailPage;
