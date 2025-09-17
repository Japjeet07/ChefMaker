"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "../../components/ui/SafeImage";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-white text-xl">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen gradient-bg p-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-4">
            🛒 Your Recipe Cart
          </h1>
          <p className="text-xl text-gray-200 text-shadow">
            {cart.length} recipe{cart.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center animate-fade-in-up">
            <div className="glass-effect p-12 rounded-2xl max-w-md mx-auto">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-300 mb-6">Start exploring recipes and add them to your cart!</p>
              <Link
                href="/types"
                className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-blue-500 transition-all duration-300 hover-lift"
              >
                🌍 Browse Cuisines
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item, idx) => (
              <div
                key={item._id}
                className="glass-effect rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="relative">
                  <SafeImage
                    src={item.recipe.image}
                    alt={item.recipe.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="glass-effect px-3 py-1 rounded-full text-white text-sm">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.recipe.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {item.recipe.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                    <span>⏱️ {item.recipe.prepTime + item.recipe.cookTime} min</span>
                    <span>👥 {item.recipe.servings} servings</span>
                    <span>🏷️ {item.recipe.cuisine}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/recipes/${item.recipe._id}`}
                      className="glass-effect px-4 py-2 rounded-full text-white font-semibold hover:bg-blue-500 transition-all duration-300"
                    >
                      👁️ View Recipe
                    </Link>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="glass-effect px-4 py-2 rounded-full text-white font-semibold hover:bg-red-500 transition-all duration-300"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="text-center mt-12 animate-fade-in-up">
            <div className="glass-effect p-6 rounded-2xl max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                🎉 Ready to cook?
              </h3>
              <p className="text-gray-300 mb-4">
                You have {cart.length} recipe{cart.length !== 1 ? 's' : ''} in your cart
              </p>
              <div className="space-x-4">
                <Link
                  href="/types"
                  className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-green-500 transition-all duration-300 hover-lift"
                >
                  🔍 Find More Recipes
                </Link>
                <button
                  onClick={() => {
                    alert('Meal planning feature coming soon! 🚀');
                  }}
                  className="glass-effect px-6 py-3 rounded-full text-white font-semibold hover:bg-purple-500 transition-all duration-300 hover-lift"
                >
                  📋 Plan Meals
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default CartPage;
