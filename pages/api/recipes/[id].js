import connectDB from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;
  const { id } = req.query;

  // Validate ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid recipe ID'
    });
  }

  switch (method) {
    case 'GET':
      try {
        const recipe = await Recipe.findById(id);
        
        if (!recipe) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found'
          });
        }

        res.status(200).json({
          success: true,
          data: recipe
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching recipe',
          error: error.message
        });
      }
      break;

    case 'PUT':
      try {
        const recipe = await Recipe.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
        );

        if (!recipe) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found'
          });
        }

        res.status(200).json({
          success: true,
          data: recipe
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Error updating recipe',
          error: error.message
        });
      }
      break;

    case 'DELETE':
      try {
        const recipe = await Recipe.findByIdAndDelete(id);

        if (!recipe) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Recipe deleted successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error deleting recipe',
          error: error.message
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`
      });
      break;
  }
}
