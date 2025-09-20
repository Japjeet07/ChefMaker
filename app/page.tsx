import Link from "next/link";
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
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 text-blue-900" style={{fontFamily: 'inherit'}}>LetHimCook</h1>
              <h3 className="text-lg sm:text-2xl md:text-3xl mb-4 sm:mb-8 text-blue-700">Your Ultimate Culinary Platform</h3>
              <p className="text-sm sm:text-lg md:text-xl mb-8 sm:mb-12 leading-relaxed text-gray-700 max-w-4xl mx-auto px-2">Join over 50,000 chefs and food enthusiasts sharing recipes, techniques, and culinary wisdom. From home cooks to Michelin-starred chefs, everyone has a place in our community.</p>
              
              {/* Runway for the plane - positioned lower and side view */}
              <div className="mt-16 sm:mt-20 max-w-4xl mx-auto px-2">
                <div className="relative">
                  {/* Runway from side view - horizontal strip */}
                  <div className="w-full h-8 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 rounded-lg shadow-lg relative overflow-hidden">
                    {/* Runway surface texture */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                    {/* Runway center line - horizontal */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-500 transform -translate-y-1/2"></div>
                    {/* Runway edge lines */}
                    <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-500"></div>
                    <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-gray-500"></div>
                    {/* Runway markings - dashed lines */}
                    <div className="absolute top-1/2 left-8 w-4 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-16 w-4 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-8 w-4 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-16 w-4 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Full-screen clouds with right-side box */}
        <div className="h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          <div className="absolute inset-0 flex items-center justify-end p-4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl h-auto max-h-[70vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center">🔍</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-900 font-serif text-center">Search Recipes</h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-700 leading-relaxed text-center">Find thousands of recipes by ingredients, cuisine type, cooking time, or dietary preferences. Our advanced search filters help you discover the perfect dish for any occasion.</p>
              <div className="text-center">
                <Link href="/recipes" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold rounded-full hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Search Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Full-screen clouds with left-side box */}
        <div className="h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          <div className="absolute inset-0 flex items-center justify-start p-4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl h-auto max-h-[70vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center">🌍</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-900 font-serif text-center">Explore Cuisines</h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-700 leading-relaxed text-center">Discover authentic recipes from around the world. From Italian pasta to Japanese sushi, explore diverse culinary traditions and expand your cooking repertoire.</p>
              <div className="text-center">
                <Link href="/cuisines" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Explore Cuisines
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Full-screen clouds with right-side box */}
        <div className="h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          <div className="absolute inset-0 flex items-center justify-end p-4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl h-auto max-h-[70vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center">📝</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-900 font-serif text-center">Create Blog Posts</h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-700 leading-relaxed text-center">Share your cooking experiences, write tutorials, and build your culinary reputation. Our blogging platform helps you share your passion with the world.</p>
              <div className="text-center">
                <Link href="/blog/new" className="inline-block px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Write Blog
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Full-screen clouds with left-side box */}
        <div className="h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax clouds" style={{backgroundImage: `url("${EXTERNAL_URLS.CLOUD_IMAGE}")`}}></div>
          <div className="absolute inset-0 flex items-center justify-start p-4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl h-auto max-h-[70vh] flex flex-col justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/30 relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center">➕</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-900 font-serif text-center">Add Your Recipe</h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-700 leading-relaxed text-center">Share your favorite recipes with the community. Upload photos, write detailed instructions, and help others discover amazing dishes.</p>
              <div className="text-center">
                <Link href="/recipes/new" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-semibold rounded-full hover:from-indigo-500 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm sm:text-base">
                  Add Recipe
                </Link>
              </div>
            </div>
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