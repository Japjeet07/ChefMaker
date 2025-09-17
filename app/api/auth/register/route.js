import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

// POST /api/auth/register
export async function POST(request) {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return Response.json({
        success: false,
        message: 'Please provide all required fields'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({
        success: false,
        message: 'Password must be at least 6 characters'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({
        success: false,
        message: 'User already exists with this email'
      }, { status: 400 });
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

    return Response.json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({
      success: false,
      message: 'Error creating user',
      error: error.message
    }, { status: 500 });
  }
}
