"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "../../components/ui/SafeImage";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { CartItem, Recipe } from "../../types";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
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

      if (response.ok) {
        const data = await response.json();
        setCart(data.data || []);
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
      <div className="min-h-screen gradient-bg p-5 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow mb-6">
              🛒 Your Cart
            </h1>
            <p className="text-gray-200 text-lg">
              {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                <p className="text-gray-300 mb-6">
                  Start adding some delicious recipes to your cart!
                </p>
                <Link
                  href="/cuisines"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift"
                >
                  🍽️ Browse Recipes
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {cart.map((item, index) => {
                // Handle both populated recipe objects and recipe IDs
                const recipe = typeof item.recipe === 'object' ? item.recipe : null;
                const recipeId = typeof item.recipe === 'string' ? item.recipe : recipe?._id;
                
                return (
                  <div
                    key={item._id || index}
                    className="glass-effect rounded-2xl p-6 hover-lift"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <SafeImage
                          src={recipe?.image || 'https://via.placeholder.com/150x150'}
                          alt={recipe?.name || 'Recipe'}
                          width={150}
                          height={150}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {recipe?.name || 'Unknown Recipe'}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {recipe?.description || 'No description available'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>🍽️ {recipe?.cuisine}</span>
                          <span>⏱️ {(recipe?.prepTime || 0) + (recipe?.cookTime || 0)} min</span>
                          <span>👥 {recipe?.servings} servings</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-white font-semibold">Quantity</div>
                          <div className="text-2xl font-bold text-yellow-400">{item.quantity}</div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover-lift"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CartPage;

