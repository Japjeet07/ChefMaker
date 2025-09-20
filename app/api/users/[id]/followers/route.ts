import connectDB from '../../../../../utils/mongodb';
import User from '../../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id]/followers - Get followers of a user
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    const { id: userId } = await params;

    const user = await User.findById(userId).select('followers').populate('followers', 'name email _id');
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: user.followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return Response.json({ 
      success: false, 
      message: 'Error fetching followers', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
