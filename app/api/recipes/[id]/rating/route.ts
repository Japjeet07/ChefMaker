import connectDB from '../../../../../utils/mongodb';
import Recipe from '../../../../../models/Recipe';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiResponse, AddRecipeRatingRequest } from '../../../../../types';

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

// POST /api/recipes/[id]/rating - Add or update a rating for a recipe
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

    const { rating }: AddRecipeRatingRequest = await request.json();

    if (rating !== 0 && (!rating || rating < 1 || rating > 5)) {
      const response: ApiResponse = {
        success: false,
        message: 'Rating must be between 1 and 5, or 0 to remove rating'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex((r: any) => r.user.toString() === user._id.toString());
    
    if (existingRatingIndex !== -1) {
      if (rating === 0) {
        // Remove existing rating
        recipe.ratings.splice(existingRatingIndex, 1);
        await recipe.save();
        
        // Refresh the document to get updated virtual fields
        const updatedRecipe = await Recipe.findById(id);
        
        const response: ApiResponse = {
          success: true,
          message: 'Rating removed successfully',
          data: { 
            rating: 0, 
            averageRating: updatedRecipe?.averageRating || 0, 
            ratingsCount: updatedRecipe?.ratingsCount || 0 
          }
        };
        return Response.json(response);
      } else {
        // Update existing rating
        recipe.ratings[existingRatingIndex].rating = rating;
        await recipe.save();
        
        // Refresh the document to get updated virtual fields
        const updatedRecipe = await Recipe.findById(id);
        
        const response: ApiResponse = {
          success: true,
          message: 'Rating updated successfully',
          data: { 
            rating, 
            averageRating: updatedRecipe?.averageRating || 0, 
            ratingsCount: updatedRecipe?.ratingsCount || 0 
          }
        };
        return Response.json(response);
      }
    } else {
      if (rating === 0) {
        const response: ApiResponse = {
          success: false,
          message: 'No rating found to remove'
        };
        return Response.json(response, { status: 404 });
      }
      
      // Add new rating
      recipe.ratings.push({ user: user._id, rating });
      await recipe.save();
      
      // Refresh the document to get updated virtual fields
      const updatedRecipe = await Recipe.findById(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Rating added successfully',
        data: { 
          rating, 
          averageRating: updatedRecipe?.averageRating || 0, 
          ratingsCount: updatedRecipe?.ratingsCount || 0 
        }
      };
      return Response.json(response);
    }
  } catch (error) {
    console.error('Recipe rating error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error rating recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// DELETE /api/recipes/[id]/rating - Remove a rating for a recipe
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
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

    // Remove user's rating
    const initialLength = recipe.ratings.length;
        recipe.ratings = recipe.ratings.filter((r: any) => r.user.toString() !== user._id.toString());
    
    if (recipe.ratings.length === initialLength) {
      const response: ApiResponse = {
        success: false,
        message: 'No rating found to remove'
      };
      return Response.json(response, { status: 404 });
    }

    await recipe.save();
    
    // Refresh the document to get updated virtual fields
    const updatedRecipe = await Recipe.findById(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Rating removed successfully',
      data: { 
        averageRating: updatedRecipe?.averageRating || 0, 
        ratingsCount: updatedRecipe?.ratingsCount || 0 
      }
    };
    return Response.json(response);
  } catch (error) {
    console.error('Recipe rating DELETE error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error removing rating',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}
