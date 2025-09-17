import connectDB from '../../../../utils/mongodb';
import Recipe from '../../../../models/Recipe';
import { NextRequest } from 'next/server';
import { ApiResponse, Recipe as RecipeType } from '../../../../types';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/recipes/[id]
export async function GET(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    await connectDB();
    
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

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<RecipeType> = {
      success: true,
      data: recipe
    };

    return Response.json(response);
  } catch (error) {
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
    
    const { id } = await params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid recipe ID'
      };
      return Response.json(response, { status: 400 });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Recipe deleted successfully'
    };

    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Error deleting recipe',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

