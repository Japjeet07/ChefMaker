import connectDB from '../../../../../utils/mongodb';
import Blog from '../../../../../models/Blog';
import User from '../../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';
import { verifyToken } from '../../../../../utils/auth';


// GET /api/blogs/[id]/comments - Get all comments for a blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const { id } = await params;
    const blog = await Blog.findById(id)
      .populate('comments.user', 'name avatar')
      .lean() as any;

    if (!blog) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: blog.comments
    };

    return Response.json(response);
  } catch (error) {
    console.error('Blog comments GET error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching comments',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// POST /api/blogs/[id]/comments - Add a comment to a blog
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

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment content is required'
      };
      return Response.json(response, { status: 400 });
    }

    if (content.length > 500) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment cannot be more than 500 characters'
      };
      return Response.json(response, { status: 400 });
    }

    // Add comment
    const newComment = {
      user: user._id,
      content: content.trim()
    };

    blog.comments.push(newComment);
    await blog.save();

    // Populate the new comment with user data
    await blog.populate('comments.user', 'name avatar');
    const addedComment = blog.comments[blog.comments.length - 1];

    const response: ApiResponse = {
      success: true,
      message: 'Comment added successfully',
      data: addedComment
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error('Blog comment POST error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error adding comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
