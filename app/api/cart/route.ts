import connectDB from '../../../utils/mongodb';
import User from '../../../models/User';
import Recipe from '../../../models/Recipe';
import { NextRequest } from 'next/server';
import { ApiResponse, AddToCartRequest, RemoveFromCartRequest } from '../../../types';
import { verifyToken } from '../../../utils/auth';

  

// GET /api/cart
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId).populate('cart.recipe');
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: user.cart
    };

    return Response.json(response);
  } catch (error) {
    console.error('Cart GET error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error fetching cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// POST /api/cart
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const { recipeId, quantity = 1 }: AddToCartRequest = await request.json();

    if (!recipeId) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe ID is required'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      const response: ApiResponse = {
        success: false,
        message: 'Recipe not found'
      };
      return Response.json(response, { status: 404 });
    }

    // Check if recipe is already in cart
    const existingItem = user.cart.find((item: { recipe: { toString: () => string; }; }) => 
      item.recipe.toString() === recipeId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        recipe: recipeId,
        quantity: quantity
      });
    }

    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Recipe added to cart',
      data: user.cart
    };

    return Response.json(response);
  } catch (error) {
    console.error('Cart POST error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error adding to cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

// DELETE /api/cart
export async function DELETE(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      return Response.json(response, { status: 404 });
    }

    const { itemId }: RemoveFromCartRequest = await request.json();

    if (!itemId) {
      const response: ApiResponse = {
        success: false,
        message: 'Item ID is required'
      };
      return Response.json(response, { status: 400 });
    }

    user.cart = user.cart.filter((item: { _id: { toString: () => string; }; }) => 
      item._id.toString() !== itemId
    );

    await user.save();

    const response: ApiResponse = {
      success: true,
      message: 'Item removed from cart',
      data: user.cart
    };

    return Response.json(response);
  } catch (error) {
    console.error('Cart DELETE error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required'
      };
      return Response.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: false,
      message: 'Error removing from cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

