import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiResponse, AuthResponse, RegisterRequest } from '../../../../types';

// POST /api/auth/register
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const { name, email, password }: RegisterRequest = await request.json();

    // Validation
    if (!name || !email || !password) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide all required fields'
      };
      return Response.json(response, { status: 400 });
    }

    if (password.length < 6) {
      const response: ApiResponse = {
        success: false,
        message: 'Password must be at least 6 characters'
      };
      return Response.json(response, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User already exists with this email'
      };
      return Response.json(response, { status: 400 });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          favorites: user.favorites,
          cart: user.cart,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      }
    };

    return Response.json(response, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

