import Link from "next/link";
import SearchBar from "../components/features/SearchBar";
import CookingScene from "../components/3d/CookingScene";
import FloatingEmojis from "../components/ui/FloatingEmojis";
import { EXTERNAL_URLS } from "../constants";

export default async function Home() {
  return (
    <>
      <CookingScene />
      <div className="content relative">
        <div className="trigger"></div>
        
        {/* Hero Section: Horizontal (wide) in the middle */}
        <div className="h-screen flex items-center justify-center relative">
          {/* Background Clouds */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-20 bg-white/40 rounded-full blur-sm"></div>
            <div className="absolute top-20 right-20 w-24 h-16 bg-white/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-20 left-1/4 w-28 h-18 bg-white/35 rounded-full blur-sm"></div>
            <div className="absolute bottom-10 right-1/3 w-20 h-14 bg-white/25 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-22 bg-white/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 left-1/6 w-24 h-15 bg-white/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/3 right-1/6 w-26 h-16 bg-white/25 rounded-full blur-sm"></div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 sm:p-8 md:p-12 max-w-6xl w-full mx-4 sm:mx-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
            <div className="text-center text-gray-800">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 text-blue-900">ChefMaker</h1>
              <h3 className="text-lg sm:text-2xl md:text-3xl mb-4 sm:mb-8 text-blue-700">Your Ultimate Culinary Platform</h3>
              <p className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-12 leading-relaxed text-gray-700 max-w-4xl mx-auto px-2">Join over 50,000 chefs and food enthusiasts sharing recipes, techniques, and culinary wisdom. From home cooks to Michelin-starred chefs, everyone has a place in our community.</p>
              
              <div className="mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
                <SearchBar />
              </div>
                          
              
              <div className="text-sm sm:text-lg text-blue-600">Scroll to explore features</div>
            </div>
          </div>
        </div>

        {/* Section 1: Right = Content, Left = Clouds */}
        <div className="h-screen flex">
          <div className="w-1/2 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          </div>
          <div className="w-1/2 h-full flex items-center justify-center p-1 sm:p-2 md:p-4 relative">
            {/* Background Clouds */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-5 left-5 w-20 h-12 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-5 right-5 w-16 h-10 bg-white/35 rounded-full blur-sm"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-14 bg-white/30 rounded-full blur-sm"></div>
              <div className="absolute top-1/3 right-1/3 w-18 h-11 bg-white/25 rounded-full blur-sm"></div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🔍</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-blue-900 font-serif">Search Recipes</h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-700 leading-relaxed">Find thousands of recipes by ingredients, cuisine type, cooking time, or dietary preferences. Our advanced search filters help you discover the perfect dish for any occasion.</p>
              <Link href="/recipes" className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold rounded-full hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                Search Recipes
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Left = Content, Right = Clouds */}
        <div className="h-screen flex">
          <div className="w-1/2 h-full flex items-center justify-center p-1 sm:p-2 md:p-4 relative">
            {/* Background Clouds */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-8 right-8 w-18 h-11 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-8 left-8 w-22 h-13 bg-white/35 rounded-full blur-sm"></div>
              <div className="absolute top-1/3 right-1/4 w-20 h-12 bg-white/30 rounded-full blur-sm"></div>
              <div className="absolute bottom-1/3 left-1/3 w-16 h-10 bg-white/25 rounded-full blur-sm"></div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🌍</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-blue-900 font-serif">Explore Cuisines</h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-700 leading-relaxed">Discover authentic recipes from around the world. From Italian pasta to Japanese sushi, explore diverse culinary traditions and expand your cooking repertoire.</p>
              <Link href="/cuisines" className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                Explore Cuisines
              </Link>
            </div>
          </div>
          <div className="w-1/2 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          </div>
        </div>

        {/* Section 3: Right = Content, Left = Clouds */}
        <div className="h-screen flex">
          <div className="w-1/2 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          </div>
          <div className="w-1/2 h-full flex items-center justify-center p-1 sm:p-2 md:p-4 relative">
            {/* Background Clouds */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-6 left-6 w-24 h-14 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-6 right-6 w-18 h-11 bg-white/35 rounded-full blur-sm"></div>
              <div className="absolute top-2/3 left-1/3 w-20 h-12 bg-white/30 rounded-full blur-sm"></div>
              <div className="absolute top-1/4 right-1/4 w-22 h-13 bg-white/25 rounded-full blur-sm"></div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📝</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-blue-900 font-serif">Create Blog Posts</h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-700 leading-relaxed">Share your cooking experiences, write tutorials, and build your culinary reputation. Our blogging platform helps you share your passion with the world.</p>
              <Link href="/blog/new" className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                Write Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Section 4: Left = Content, Right = Clouds */}
        <div className="h-screen flex">
          <div className="w-1/2 h-full flex items-center justify-center p-1 sm:p-2 md:p-4 relative">
            {/* Background Clouds */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 w-22 h-13 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 right-4 w-16 h-10 bg-white/35 rounded-full blur-sm"></div>
              <div className="absolute top-1/2 right-1/4 w-26 h-15 bg-white/30 rounded-full blur-sm"></div>
              <div className="absolute bottom-1/4 left-1/4 w-20 h-12 bg-white/25 rounded-full blur-sm"></div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">➕</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-blue-900 font-serif">Add Your Recipe</h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-700 leading-relaxed">Share your favorite recipes with the community. Upload photos, write detailed instructions, and help others discover amazing dishes.</p>
              <Link href="/recipes/new" className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-semibold rounded-full hover:from-indigo-500 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                Add Recipe
              </Link>
            </div>
          </div>
          <div className="w-1/2 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          </div>
        </div>
        
        {/* Final CTA Section: Horizontal (wide) in the middle */}
        <div className="h-screen flex items-center justify-center relative">
          {/* Background Clouds */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-40 h-24 bg-white/40 rounded-full blur-sm"></div>
            <div className="absolute top-40 right-30 w-32 h-20 bg-white/35 rounded-full blur-sm"></div>
            <div className="absolute bottom-40 left-1/3 w-36 h-22 bg-white/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-20 right-1/4 w-28 h-17 bg-white/25 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 w-44 h-26 bg-white/20 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 left-1/6 w-30 h-18 bg-white/30 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/3 right-1/6 w-34 h-20 bg-white/25 rounded-full blur-sm"></div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 sm:p-8 md:p-12 max-w-6xl w-full mx-4 sm:mx-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
            <div className="text-center text-gray-800">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-blue-900">Ready to Start Cooking?</h2>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-700 max-w-4xl mx-auto px-2">Join thousands of chefs and food enthusiasts sharing their passion for cooking</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/recipes" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold rounded-full hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Browse Recipes
                </Link>
                <Link href="/blog" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Read Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Single Floating Emojis Component for entire page */}
        <FloatingEmojis 
          count={25} 
          duration={20} 
          emojiType="all" 
          className="fixed inset-0 pointer-events-none z-50"
        />
      </div>
    </>
  );
}