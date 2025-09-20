import connectDB from '../../../../utils/mongodb';
import Blog from '../../../../models/Blog';
import User from '../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse, UpdateBlogRequest } from '../../../../types';
import { verifyToken } from '../../../../utils/auth';

// GET /api/blogs/[id] - Get a specific blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const { id } = await params;
    const blog = await Blog.findById(id)
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!blog) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog not found'
      };
      return Response.json(response, { status: 404 });
    }

    if (!blog.isPublic) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog is private'
      };
      return Response.json(response, { status: 403 });
    }

    const response: ApiResponse = {
      success: true,
      data: blog
    };

    return Response.json(response);
  } catch (error) {
    console.error('Blog GET error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching blog',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user is the author
    if (blog.author.toString() !== decoded.userId) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized to edit this blog'
      };
      return Response.json(response, { status: 403 });
    }

    const { title, content, image, video, tags, isPublic }: UpdateBlogRequest = await request.json();

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    if (video !== undefined) updateData.video = video;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    const response: ApiResponse = {
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    };

    return Response.json(response);
  } catch (error) {
    console.error('Blog PUT error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error updating blog',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      const response: ApiResponse = {
        success: false,
        message: 'Blog not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user is the author
    if (blog.author.toString() !== decoded.userId) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized to delete this blog'
      };
      return Response.json(response, { status: 403 });
    }

    await Blog.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Blog deleted successfully'
    };

    return Response.json(response);
  } catch (error) {
    console.error('Blog DELETE error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error deleting blog',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
