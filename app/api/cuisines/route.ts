import connectDB from '../../../utils/mongodb';
import Recipe from '../../../models/Recipe';
import { ApiResponse } from '../../../types';

// GET /api/cuisines
export async function GET(): Promise<Response> {
  try {
    await connectDB();
    
    // Get unique cuisines from the database
    const cuisines = await Recipe.distinct('cuisine');
    
    const response: ApiResponse<string[]> = {
      success: true,
      data: cuisines.sort()
    };
    
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching cuisines',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

