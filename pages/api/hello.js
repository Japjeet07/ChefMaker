// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Recipe Finder API is running!',
    endpoints: {
      recipes: '/api/recipes',
      cuisines: '/api/cuisines',
      singleRecipe: '/api/recipes/[id]'
    }
  })
}
