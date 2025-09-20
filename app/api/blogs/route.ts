import connectDB from '../../../utils/mongodb';
import Blog from '../../../models/Blog';
import User from '../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse, CreateBlogRequest, PaginatedResponse } from '../../../types';
import { verifyToken } from '../../../utils/auth';



// GET /api/blogs - Get all public blogs with pagination
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Blog.countDocuments({ isPublic: true });
    
    // Get blogs with author information
    const blogs = await Blog.find({ isPublic: true })
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const response: PaginatedResponse<typeof blogs> = {
      success: true,
      data: blogs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Blogs GET error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching blogs',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const { title, content, image, video, tags, isPublic = true }: CreateBlogRequest = await request.json();

    if (!title || !content) {
      const response: ApiResponse = {
        success: false,
        message: 'Title and content are required'
      };
      return Response.json(response, { status: 400 });
    }

    const blog = await Blog.create({
      title,
      content,
      image,
      video,
      author: user._id,
      tags: tags || [],
      isPublic
    });

    // Populate author information
    await blog.populate('author', 'name email avatar');

    const response: ApiResponse = {
      success: true,
      message: 'Blog created successfully',
      data: blog
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error creating blog',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
