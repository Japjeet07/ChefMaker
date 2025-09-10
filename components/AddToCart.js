"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const AddToCart = ({ recipeId, name }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { user, requireAuth, setShowAuthModal } = useAuth();

  const handleAddToCart = async () => {
    const canProceed = requireAuth(() => true);
    if (!canProceed) return;

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId: recipeId,
          quantity: 1
        })
      });

      const data = await response.json();

      if (data.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      alert('Error adding to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`relative overflow-hidden glass-effect px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 hover-lift ${
        added 
          ? 'bg-green-500 animate-bounce-in' 
          : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleAddToCart}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <span className="animate-spin">⏳</span>
          <span>Adding...</span>
        </span>
      ) : added ? (
        <span className="flex items-center space-x-2">
          <span>✅</span>
          <span>Added!</span>
        </span>
      ) : (
        <span className="flex items-center space-x-2">
          <span>🛒</span>
          <span>Add to Cart</span>
        </span>
      )}
      
      {!loading && !added && (
        <div className="absolute inset-0 animate-shimmer"></div>
      )}
    </button>
  );
};

export default AddToCart;
