import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// Helper function to verify JWT token
export const verifyToken = (request: NextRequest): any => {
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

// Helper function to generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
};
