import connectDB from '../../../../../utils/mongodb';
import User from '../../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id]/following - Get users that a user is following
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    const { id: userId } = await params;

    const user = await User.findById(userId).select('following').populate('following', 'name email _id');
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user.following });
  } catch (error) {
    console.error('Error fetching following:', error);
    return Response.json({ 
      success: false, 
      message: 'Error fetching following', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
