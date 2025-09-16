import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Recipe from '../../../models/Recipe';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export default async function handler(req, res) {
  await connectDB();

  try {
    const decoded = verifyToken(req);
    const user = await User.findById(decoded.userId).populate('cart.recipe');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        res.status(200).json({
          success: true,
          data: user.cart
        });
        break;

      case 'POST':
        const { recipeId, quantity = 1 } = req.body;

        if (!recipeId) {
          return res.status(400).json({
            success: false,
            message: 'Recipe ID is required'
          });
        }

        // Check if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found'
          });
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

        res.status(200).json({
          success: true,
          message: 'Recipe added to cart',
          data: user.cart
        });
        break;

      case 'DELETE':
        const { itemId } = req.body;

        if (!itemId) {
          return res.status(400).json({
            success: false,
            message: 'Item ID is required'
          });
        }

        user.cart = user.cart.filter(item => 
          item._id.toString() !== itemId
        );

        await user.save();

        res.status(200).json({
          success: true,
          message: 'Item removed from cart',
          data: user.cart
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({
          success: false,
          message: `Method ${method} not allowed`
        });
        break;
    }

  } catch (error) {
    console.error('Cart API error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing cart request',
      error: error.message
    });
  }
}

