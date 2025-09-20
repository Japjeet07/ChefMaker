import connectDB from '../../../../../utils/mongodb';
import User from '../../../../../models/User';
import Recipe from '../../../../../models/Recipe';
import Blog from '../../../../../models/Blog';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id]/posts - Get user's recipes and blogs
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    const { id: userId } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'recipes', 'blogs', or 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const skip = (page - 1) * limit;
    let data: any = {};

    if (type === 'recipes' || type === 'all') {
      const recipes = await Recipe.find({ createdBy: userId })
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(type === 'all' ? Math.ceil(limit / 2) : limit)
        .lean();

      data.recipes = recipes;
    }

    if (type === 'blogs' || type === 'all') {
      const blogs = await Blog.find({ author: userId })
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(type === 'all' ? Math.ceil(limit / 2) : limit)
        .lean();

      data.blogs = blogs;
    }

    const response: ApiResponse = {
      success: true,
      data
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching user posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
