import Link from "next/link";
import SearchBar from "../components/features/SearchBar";

export default async function Home() {
  return (
    <div className="min-h-screen w-full homepage relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <span className="text-6xl opacity-20">🍳</span>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <span className="text-5xl opacity-20">👨‍🍳</span>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <span className="text-7xl opacity-20">🥘</span>
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '0.5s' }}>
        <span className="text-6xl opacity-20">🍽️</span>
      </div>

      <div className="text-center w-4/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 server">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl my-8 font-bold text-white text-shadow animate-bounce-in">
            🍽️ FoodieHub
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-white text-shadow">
            Explore food from around the world
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-200 text-shadow max-w-2xl mx-auto">
            Discover amazing recipes, create your own culinary masterpieces, and share your food adventures with fellow food lovers! 🌟
          </p>
        </div>
        
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <SearchBar />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            className="group glass-effect px-8 py-4 rounded-2xl text-white font-bold text-xl hover-lift animate-pulse-glow"
            href="/types"
          >
            <span className="flex items-center space-x-3">
              <span className="text-2xl group-hover:animate-bounce">🌍</span>
              <span>Browse Cuisines</span>
            </span>
          </Link>
          <Link
            className="group glass-effect px-8 py-4 rounded-2xl text-white font-bold text-xl hover-lift"
            href="/recipes/new"
          >
            <span className="flex items-center space-x-3">
              <span className="text-2xl group-hover:animate-bounce">✨</span>
              <span>Add Recipe</span>
            </span>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="glass-effect p-6 rounded-2xl hover-lift">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Search</h3>
            <p className="text-gray-300">Find recipes by ingredients, cuisine, or any keyword</p>
          </div>
          <div className="glass-effect p-6 rounded-2xl hover-lift">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Community</h3>
            <p className="text-gray-300">Share and discover recipes from food lovers worldwide</p>
          </div>
          <div className="glass-effect p-6 rounded-2xl hover-lift">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-white mb-2">Shopping Cart</h3>
            <p className="text-gray-300">Save your favorite recipes for easy meal planning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
