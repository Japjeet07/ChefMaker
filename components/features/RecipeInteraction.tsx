"use client";

import React, { useState } from "react";
import { Recipe, RecipeComment } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

interface RecipeInteractionProps {
  recipe: Recipe;
  onUpdate: (updatedRecipe: Recipe) => void;
}

const RecipeInteraction: React.FC<RecipeInteractionProps> = ({ recipe, onUpdate }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const isLiked = user && recipe.likes?.some(like => like.user === user._id);
  const userRatingData = user && recipe.ratings?.find(rating => rating.user === user._id);

  const handleLike = async (): Promise<void> => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/recipes/${recipe._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const updatedRecipe = {
          ...recipe,
          likes: isLiked 
            ? (recipe.likes || []).filter(like => like.user !== user._id)
            : [...(recipe.likes || []), { user: user._id, createdAt: new Date().toISOString() }],
          likesCount: data.data.likesCount
        };
        onUpdate(updatedRecipe);
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRating = async (rating: number): Promise<void> => {
    if (!user || isRating) return;

    setIsRating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/recipes/${recipe._id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedRecipe = {
          ...recipe,
          averageRating: data.data.averageRating,
          ratingsCount: data.data.ratingsCount,
          ratings: rating === 0 
            ? (recipe.ratings || []).filter(r => r.user !== user._id)
            : userRatingData 
              ? (recipe.ratings || []).map(r => r.user === user._id ? { ...r, rating } : r)
              : [...(recipe.ratings || []), { user: user._id, rating, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
        };
        onUpdate(updatedRecipe);
        setUserRating(rating);
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
    } finally {
      setIsRating(false);
    }
  };

  const handleComment = async (): Promise<void> => {
    if (!user || !newComment.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/recipes/${recipe._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedRecipe = {
          ...recipe,
          comments: [...(recipe.comments || []), data.data],
          commentsCount: (recipe.commentsCount || 0) + 1
        };
        onUpdate(updatedRecipe);
        setNewComment("");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false): React.ReactNode => {
    const displayRating = interactive ? (hoverRating || rating) : rating;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive || isRating}
            className={`text-2xl transition-all duration-200 ${
              interactive 
                ? 'hover:scale-110 cursor-pointer' 
                : 'cursor-default'
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                star <= displayRating 
                  ? 'text-yellow-400 fill-current drop-shadow-lg' 
                  : 'text-gray-400 fill-none stroke-current stroke-2'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Like and Rating Section */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-white hover:text-red-400'
              } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-semibold">{recipe.likesCount || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              <span className="text-2xl">💬</span>
              <span className="font-semibold">{recipe.commentsCount || 0}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">Rating:</span>
            {renderStars(recipe.averageRating || 0)}
            <span className="text-gray-400 text-sm">({recipe.ratingsCount || 0})</span>
          </div>
        </div>

        {/* User Rating Section */}
        {user && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">Your Rating:</span>
              {renderStars(userRatingData?.rating || 0, true)}
              {userRatingData && (
                <button
                  onClick={() => handleRating(0)}
                  disabled={isRating}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Remove
                </button>
              )}
              {!userRatingData && (
                <span className="text-gray-400 text-sm">Click stars to rate</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-white text-xl font-bold mb-4">Comments</h3>
          
          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {(recipe.comments || []).length === 0 ? (
              <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              (recipe.comments || []).map((comment: RecipeComment) => (
                <div key={comment._id} className="border-b border-white/10 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-semibold">{comment.user.name}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment - Moved to bottom */}
          {user && (
            <div className="border-t border-white/10 pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                className="w-full p-3 glass-effect rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">{newComment.length}/500</span>
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim() || isCommenting}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    !newComment.trim() || isCommenting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover-lift'
                  } text-white`}
                >
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeInteraction;
