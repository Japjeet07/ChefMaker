import connectDB from '../../../../../utils/mongodb';
import Blog from '../../../../../models/Blog';
import User from '../../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';
import { verifyToken } from '../../../../../utils/auth';



// POST /api/blogs/[id]/like - Like or unlike a blog
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const { id } = await params;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user already liked this blog
    const existingLike = blog.likes.find((like: any) => like.user.toString() === user._id.toString());
    
    if (existingLike) {
      // Unlike the blog
      blog.likes = blog.likes.filter((like: any) => like.user.toString() !== user._id.toString());
      await blog.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Blog unliked',
        data: { liked: false, likesCount: blog.likesCount }
      };
      return Response.json(response);
    } else {
      // Like the blog
      blog.likes.push({ user: user._id });
      await blog.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Blog liked',
        data: { liked: true, likesCount: blog.likesCount }
      };
      return Response.json(response);
    }
  } catch (error) {
    console.error('Blog like error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error liking blog',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
