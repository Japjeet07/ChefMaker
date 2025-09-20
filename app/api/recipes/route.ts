import connectDB from '../../../utils/mongodb';
import Recipe from '../../../models/Recipe';
import User from '../../../models/User';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { ApiResponse, PaginatedResponse, Recipe as RecipeType } from '../../../types';
import { ENV_CONFIG } from '../../../constants';

// GET /api/recipes
export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Check if MongoDB URI is available
    if (!ENV_CONFIG.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      const response: ApiResponse = {
        success: false,
        message: 'Database connection not configured',
        error: 'MONGODB_URI environment variable is missing'
      };
      return Response.json(response, { status: 500 });
    }

    await connectDB();
    
    // Ensure User model is registered
    if (!mongoose.models.User) {
      require('../../../models/User');
    }
    
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
      .populate('createdBy', 'name email avatar')
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
    console.error('Error in GET /api/recipes:', error);
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
    
    // Ensure User model is registered
    if (!mongoose.models.User) {
      require('../../../models/User');
    }
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }
    
    let decoded;
    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid token'
      };
      return Response.json(response, { status: 401 });
    }
    
    const body = await request.json();
    
    // Add the user's ObjectId as createdBy
    const recipeData = {
      ...body,
      createdBy: decoded.userId
    };
    
    const recipe = await Recipe.create(recipeData);
    
    // Populate the createdBy field
    await recipe.populate('createdBy', 'name email avatar');
    
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

