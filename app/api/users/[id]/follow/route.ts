import connectDB from '../../../../../utils/mongodb';
import User from '../../../../../models/User';
import { verifyToken } from '../../../../../utils/auth';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/users/[id]/follow - Follow a user
export async function POST(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Verify authentication
    const decoded = verifyToken(request);
    const { id: targetUserId } = await params;
    const currentUserId = decoded.userId;

    // Validate ObjectId
    if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Can't follow yourself
    if (currentUserId === targetUserId) {
      const response: ApiResponse = {
        success: false,
        message: 'Cannot follow yourself'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      const response: ApiResponse = {
        success: false,
        message: 'Current user not found'
      };
      return Response.json(response, { status: 404 });
    }

    if (currentUser.following.includes(targetUserId as any)) {
      const response: ApiResponse = {
        success: false,
        message: 'Already following this user'
      };
      return Response.json(response, { status: 400 });
    }

    // Add to following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Successfully followed user'
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

    console.error('Error following user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error following user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// DELETE /api/users/[id]/follow - Unfollow a user
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Verify authentication
    const decoded = verifyToken(request);
    const { id: targetUserId } = await params;
    const currentUserId = decoded.userId;

    // Validate ObjectId
    if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if currently following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      const response: ApiResponse = {
        success: false,
        message: 'Current user not found'
      };
      return Response.json(response, { status: 404 });
    }

    if (!currentUser.following.includes(targetUserId as any)) {
      const response: ApiResponse = {
        success: false,
        message: 'Not following this user'
      };
      return Response.json(response, { status: 400 });
    }

    // Remove from following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Successfully unfollowed user'
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

    console.error('Error unfollowing user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error unfollowing user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
