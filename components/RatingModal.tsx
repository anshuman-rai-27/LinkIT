"use client";
import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { getSessionToken, getUserFromToken } from '../lib/session';

interface RatingModalProps {
  profile: {
    id: string;
    name: string;
    avatarUrl: string;
    initials: string;
    borderColor: string;
  };
  onClose: () => void;
}

export default function RatingModal({ profile, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError('Please add a comment');
      setLoading(false);
      return;
    }

    try {
      // Get user from session token
      const user = getUserFromToken();
      if (!user) {
        setError('You must be logged in to submit feedback');
        setLoading(false);
        return;
      }

      // Get session token
      const token = getSessionToken();
      if (!token) {
        setError('Session token not found');
        setLoading(false);
        return;
      }

      const feedbackData = {
        toProfileId: parseInt(profile.id),
        rating: rating,
        comment: comment.trim()
      };

      console.log('Sending feedback data:', feedbackData);

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to submit feedback';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
        console.log('Feedback submitted successfully:', result);
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        throw new Error('Invalid response from server');
      }

      // Show success message
      setSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full ${profile.borderColor} border-2 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100`}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-700">{profile.initials}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rate {profile.name}</h2>
              <p className="text-sm text-gray-700">Share your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">Feedback submitted successfully! The modal will close shortly.</p>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {rating === 0 && 'Select a rating'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Comment</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={loading || success}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none text-gray-800 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Share your experience working with this person..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || success}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 