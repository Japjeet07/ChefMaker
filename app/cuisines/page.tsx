import Link from "next/link";
import React from "react";

const fetchCuisines = async (): Promise<string[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chefmaker.onrender.com' : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/cuisines`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch cuisines');
    }
    
    const response = await res.json();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    // Fallback to some default cuisines if API fails
    return ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'French', 'Japanese', 'Thai'];
  }
};

const cuisineEmojis: Record<string, string> = {
  'Italian': '🍝',
  'Mexican': '🌮',
  'Chinese': '🥢',
  'Indian': '🍛',
  'American': '🍔',
  'French': '🥐',
  'Japanese': '🍣',
  'Thai': '🌶️',
  'Korean': '🥘',
  'Greek': '🥙',
  'Spanish': '🥘',
  'German': '🍺',
  'British': '🍵',
  'Brazilian': '🥩',
  'Turkish': '🥙'
};

const page = async (): Promise<React.JSX.Element> => {
  const cuisines = await fetchCuisines();
  
  return (
    <div className="min-h-screen gradient-bg p-5 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
            🌍 World Cuisines
          </h1>
          <p className="text-xl text-gray-200 text-shadow">
            Explore delicious recipes from around the globe
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {cuisines.map((cuisine, idx) => (
            <Link
              key={idx}
              className="group glass-effect capitalize text-center rounded-2xl p-8 cursor-pointer hover-lift animate-fade-in-up"
              href={`/cuisines/${cuisine}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {cuisineEmojis[cuisine] || '🍽️'}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                {cuisine}
              </h3>
              <div className="mt-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                Explore recipes →
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link
            href="/recipes/new"
            className="group glass-effect px-8 py-4 rounded-2xl text-white font-bold text-xl hover-lift inline-flex items-center space-x-3"
          >
            <span className="text-2xl group-hover:animate-bounce">✨</span>
            <span>Add Your Own Recipe</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

