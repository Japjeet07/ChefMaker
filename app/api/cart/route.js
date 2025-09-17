import connectDB from '../../../utils/mongodb';
import User from '../../../models/User';
import Recipe from '../../../models/Recipe';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (request) => {
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

// GET /api/cart
export async function GET(request) {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId).populate('cart.recipe');
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return Response.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    return Response.json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/cart
export async function POST(request) {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    const { recipeId, quantity = 1 } = await request.json();

    if (!recipeId) {
      return Response.json({
        success: false,
        message: 'Recipe ID is required'
      }, { status: 400 });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return Response.json({
        success: false,
        message: 'Recipe not found'
      }, { status: 404 });
    }

    // Check if recipe is already in cart
    const existingItem = user.cart.find(item => 
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

    return Response.json({
      success: true,
      message: 'Recipe added to cart',
      data: user.cart
    });
  } catch (error) {
    console.error('Cart POST error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return Response.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    return Response.json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE /api/cart
export async function DELETE(request) {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return Response.json({
        success: false,
        message: 'Item ID is required'
      }, { status: 400 });
    }

    user.cart = user.cart.filter(item => 
      item._id.toString() !== itemId
    );

    await user.save();

    return Response.json({
      success: true,
      message: 'Item removed from cart',
      data: user.cart
    });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return Response.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    return Response.json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    }, { status: 500 });
  }
}
