import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import Recipe from '../../../../models/Recipe';
import Blog from '../../../../models/Blog';
import { verifyToken } from '../../../../utils/auth';
import { NextRequest } from 'next/server';
import { ApiResponse, UserProfile } from '../../../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Get user profile
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    const { id: userId } = await params;
    let currentUserId: string | null = null;

    // Try to get current user (optional for public profiles)
    try {
      const decoded = verifyToken(request);
      currentUserId = decoded.userId;
    } catch (error) {
      // Not authenticated, that's okay for public profiles
    }

    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Get user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Get user's recipes and blogs count
    const [recipesCount, blogsCount] = await Promise.all([
      Recipe.countDocuments({ createdBy: userId }),
      Blog.countDocuments({ author: userId })
    ]);

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);
      isFollowing = currentUser?.following.includes(userId as any) || false;
    }

    // Get followers and following count
    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    const userProfile: UserProfile = {
      ...user.toObject(),
      followersCount,
      followingCount,
      recipesCount,
      blogsCount,
      isFollowing
    };

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: userProfile
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Verify authentication
    const decoded = verifyToken(request);
    const { id: userId } = await params;
    const currentUserId = decoded.userId;

    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if user is updating their own profile
    if (currentUserId !== userId) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized to update this profile'
      };
      return Response.json(response, { status: 403 });
    }

    const body = await request.json();
    const { name, bio, avatar } = body;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    console.error('Error updating user profile:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error updating user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
