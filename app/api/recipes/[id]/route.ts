import connectDB from '../../../../utils/mongodb';
import Recipe from '../../../../models/Recipe';
import User from '../../../../models/User';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { ApiResponse, Recipe as RecipeType } from '../../../../types';
import { verifyToken } from '../../../../utils/auth';

  


interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/recipes/[id]
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Ensure User model is registered
    if (!mongoose.models.User) {
      require('../../../../models/User');
    }
    
    const { id } = await params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid recipe ID'
      };
      return Response.json(response, { status: 400 });
    }

    const recipe = await Recipe.findById(id)
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');
    
    if (!recipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<RecipeType> = {
      success: true,
      data: recipe as RecipeType
    };

    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Error fetching recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// PUT /api/recipes/[id]
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Verify authentication
    const decoded = verifyToken(request);
    const { id } = await params;
    const body = await request.json();

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid recipe ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Find the recipe first to check ownership
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user is the creator of the recipe
    if (existingRecipe.createdBy.toString() !== decoded.userId) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized to edit this recipe'
      };
      return Response.json(response, { status: 403 });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    const response: ApiResponse<RecipeType> = {
      success: true,
      data: recipe
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error updating recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 400 });
  }
}

// DELETE /api/recipes/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
    // Verify authentication
    const decoded = verifyToken(request);
    const { id } = await params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid recipe ID'
      };
      return Response.json(response, { status: 400 });
    }

    // Find the recipe first to check ownership
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if user is the creator of the recipe
    if (existingRecipe.createdBy.toString() !== decoded.userId) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized to delete this recipe'
      };
      return Response.json(response, { status: 403 });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Recipe deleted successfully'
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error deleting recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

