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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-shadow -mt-52">
            🍳 Recipe Finder
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover amazing recipes from around the world. Search, create, and share your culinary masterpieces!
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-4xl mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SearchBar />
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-effect p-6 rounded-2xl text-center hover-lift">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Search</h3>
            <p className="text-gray-300">Find recipes by ingredients, cuisine, or cooking time</p>
          </div>
          
          <div className="glass-effect p-6 rounded-2xl text-center hover-lift">
            <div className="text-4xl mb-4">👨‍🍳</div>
            <h3 className="text-xl font-bold text-white mb-2">Create & Share</h3>
            <p className="text-gray-300">Add your own recipes and share them with the community</p>
          </div>
          
          <div className="glass-effect p-6 rounded-2xl text-center hover-lift">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-white mb-2">Browse Cuisines</h3>
            <p className="text-gray-300">Explore recipes from different cultures and traditions</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/cuisines"
            className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-yellow-500 transition-all duration-300 hover-lift"
          >
            🍽️ Browse Cuisines
          </Link>
          <Link
            href="/recipes/new"
            className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-green-500 transition-all duration-300 hover-lift"
          >
            ➕ Add Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

