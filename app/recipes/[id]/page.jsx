import RecipeDetailClient from "./RecipeDetailClient";

async function getRecipe(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/recipes/${id}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error("Failed to fetch recipe");
  const response = await res.json();
  return response.data;
}

export default async function RecipeDetail({ params }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl text-center animate-bounce-in">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-white mb-4">Recipe not found</h1>
        </div>
      </div>
    );
  }

  // ✅ Pass recipe as prop to client component
  return <RecipeDetailClient recipe={recipe} />;
}
