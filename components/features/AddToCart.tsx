"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AddToCartProps } from "../../types";

const AddToCart: React.FC<AddToCartProps> = ({ recipeId, onAdd }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const { user, requireAuth, setShowAuthModal } = useAuth();

  const handleAddToCart = async (): Promise<void> => {
    const canProceed = requireAuth(() => {});
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

      if (response.ok) {
        setAdded(true);
        onAdd?.();
        
        // Reset after 2 seconds
        setTimeout(() => {
          setAdded(false);
        }, 2000);
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover-lift"
      >
        🔐 Login to Add to Cart
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover-lift ${
        added
          ? 'bg-green-500 text-white'
          : loading
          ? 'bg-gray-500 text-white cursor-not-allowed'
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center">
          ✅ Added to Cart!
        </span>
      ) : loading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Adding...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          🛒 Add to Cart
        </span>
      )}
    </button>
  );
};

export default AddToCart;

