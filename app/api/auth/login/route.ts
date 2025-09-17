import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiResponse, AuthResponse, LoginRequest } from '../../../../types';

// POST /api/auth/login
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();
    
    const { email, password }: LoginRequest = await request.json();

    // Validation
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        message: 'Please provide email and password'
      };
      return Response.json(response, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials'
      };
      return Response.json(response, { status: 401 });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials'
      };
      return Response.json(response, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Login successful',
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

    return Response.json(response);

  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error during login',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return Response.json(response, { status: 500 });
  }
}

