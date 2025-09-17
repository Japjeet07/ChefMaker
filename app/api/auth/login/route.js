import connectDB from '../../../../utils/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

// POST /api/auth/login
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json({
        success: false,
        message: 'Please provide email and password'
      }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return Response.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: 'Error during login',
      error: error.message
    }, { status: 500 });
  }
}
