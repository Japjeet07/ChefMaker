import connectDB from '../../../utils/mongodb';
import Recipe from '../../../models/Recipe';

// GET /api/cuisines
export async function GET() {
  try {
    await connectDB();
    
    // Get unique cuisines from the database
    const cuisines = await Recipe.distinct('cuisine');
    
    return Response.json({
      success: true,
      data: cuisines.sort()
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error fetching cuisines',
      error: error.message
    }, { status: 500 });
  }
}
