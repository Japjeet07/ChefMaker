import connectDB from '../../../utils/mongodb';
import Recipe from '../../../models/Recipe';

// GET /api/recipes
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get('cuisine');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const query = {};

    // Filter by cuisine if provided
    if (cuisine) {
      query.cuisine = cuisine;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    return Response.json({
      success: true,
      data: recipes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const recipe = await Recipe.create(body);
    
    return Response.json({
      success: true,
      data: recipe
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return Response.json({
      success: false,
      message: 'Error creating recipe',
      error: error.message
    }, { status: 400 });
  }
}