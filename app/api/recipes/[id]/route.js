import connectDB from '../../../../utils/mongodb';
import Recipe from '../../../../models/Recipe';

// GET /api/recipes/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return Response.json({
        success: false,
        message: 'Invalid recipe ID'
      }, { status: 400 });
    }

    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return Response.json({
        success: false,
        message: 'Recipe not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/recipes/[id]
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return Response.json({
        success: false,
        message: 'Invalid recipe ID'
      }, { status: 400 });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return Response.json({
        success: false,
        message: 'Recipe not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error updating recipe',
      error: error.message
    }, { status: 400 });
  }
}

// DELETE /api/recipes/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return Response.json({
        success: false,
        message: 'Invalid recipe ID'
      }, { status: 400 });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return Response.json({
        success: false,
        message: 'Recipe not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message
    }, { status: 500 });
  }
}
