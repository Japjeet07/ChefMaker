import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../types';

// GET /api/users/search - Search users by name or email
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return Response.json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    const users = await User.find({
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ]
    })
    .select('name email _id')
    .limit(10)
    .sort({ name: 1 });

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error('Error searching users:', error);
    return Response.json({ 
      success: false, 
      message: 'Error searching users', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
