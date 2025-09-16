import connectDB from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { cuisine, search, page = 1, limit = 10 } = req.query;
        const query = {};

        // Filter by cuisine if provided
        if (cuisine) {
          query.cuisine = cuisine;
        }

        // Search functionality
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ];
        }

        const skip = (page - 1) * limit;
        
        const recipes = await Recipe.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        const total = await Recipe.countDocuments(query);

        res.status(200).json({
          success: true,
          data: recipes,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching recipes',
          error: error.message
        });
      }
      break;

    case 'POST':
      try {
        const recipe = await Recipe.create(req.body);
        res.status(201).json({
          success: true,
          data: recipe
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Error creating recipe',
          error: error.message
        });
        console.error('Error creating recipe:', error);
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`
      });
      break;
  }
}

