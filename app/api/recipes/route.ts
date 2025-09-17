import connectDB from '../../../utils/mongodb';
import Recipe from '../../../models/Recipe';
import { NextRequest } from 'next/server';
import { ApiResponse, PaginatedResponse, Recipe as RecipeType } from '../../../types';

// GET /api/recipes
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get('cuisine');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = {};

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
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    const response: PaginatedResponse<RecipeType[]> = {
      success: true,
      data: recipes as RecipeType[],
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    };

    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching recipes',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const body = await request.json();
    const recipe = await Recipe.create(body);
    
    const response: ApiResponse<RecipeType> = {
      success: true,
      data: recipe
    };
    
    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error creating recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 400 });
  }
}

