import connectDB from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }

  try {
    // Get unique cuisines from the database
    const cuisines = await Recipe.distinct('cuisine');
    
    res.status(200).json({
      success: true,
      data: cuisines.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cuisines',
      error: error.message
    });
  }
}
