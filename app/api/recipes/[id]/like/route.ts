import connectDB from '../../../../../utils/mongodb';
import Recipe from '../../../../../models/Recipe';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiResponse } from '../../../../../types';

// Helper function to verify JWT token
const verifyToken = (request: NextRequest): any => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// POST /api/recipes/[id]/like - Like or unlike a recipe
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const { id } = await params;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user already liked this recipe
    const existingLike = recipe.likes.find(like => like.user.toString() === user._id.toString());
    
    if (existingLike) {
      // Unlike the recipe
      recipe.likes = recipe.likes.filter(like => like.user.toString() !== user._id.toString());
      await recipe.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Recipe unliked',
        data: { liked: false, likesCount: recipe.likesCount }
      };
      return Response.json(response);
    } else {
      // Like the recipe
      recipe.likes.push({ user: user._id });
      await recipe.save();
      
      const response: ApiResponse = {
        success: true,
        message: 'Recipe liked',
        data: { liked: true, likesCount: recipe.likesCount }
      };
      return Response.json(response);
    }
  } catch (error) {
    console.error('Recipe like error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error liking recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
