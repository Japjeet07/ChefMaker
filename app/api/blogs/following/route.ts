import connectDB from '../../../../utils/mongodb';
import Blog from '../../../../models/Blog';
import User from '../../../../models/User';
import { verifyToken } from '../../../../utils/auth';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../types';

// GET /api/blogs/following - Get blogs from users that the current user follows
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const currentUserId = decoded.userId;

    // Get the current user to access their following list
    const currentUser = await User.findById(currentUserId).select('following');
    if (!currentUser) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // If user is not following anyone, return empty array
    if (currentUser.following.length === 0) {
      return Response.json({ 
        success: true, 
        data: [], 
        pagination: { 
          page, 
          limit, 
          total: 0, 
          pages: 0 
        } 
      });
    }

    // Get blogs from followed users
    const blogs = await Blog.find({
      author: { $in: currentUser.following },
      isPublic: true
    })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Blog.countDocuments({
      author: { $in: currentUser.following },
      isPublic: true
    });

    return Response.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching following blogs:', error);
    return Response.json({ 
      success: false, 
      message: 'Error fetching following blogs', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
