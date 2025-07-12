"use client";
import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare, Target, Plus, X as XIcon } from 'lucide-react';
import { getSessionToken, getUserFromToken } from '../lib/session';

interface RequestModalProps {
  profile: {
    id: string;
    name: string;
    avatarUrl: string;
    initials: string;
    borderColor: string;
    location: string;
    yearsExperience: string;
    skillsOffered: string[];
    skillsNeeded: string[];
    rating: number;
  };
  onClose: () => void;
}

export default function RequestModal({ profile, onClose }: RequestModalProps) {
  const [formData, setFormData] = useState({
    skills: [] as string[],
    requestedSkills: [] as string[],
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleAddRequestedSkill = (skill: string) => {
    if (skill && !formData.requestedSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requestedSkills: [...prev.requestedSkills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleRemoveRequestedSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requestedSkills: prev.requestedSkills.filter(s => s !== skill)
    }));
  };

  // Fetch logged-in user's profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user from session token
        const user = getUserFromToken();
        console.log(user);
        if (!user) {
          setError('You must be logged in to send a request');
          setLoadingProfile(false);
          return;
        }

        // Get session token
        const token = getSessionToken();
        if (!token) {
          setError('Session token not found');
          setLoadingProfile(false);
          return;
        }

        console.log('Fetching profile for user:', user);

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await response.json();
        console.log('User profile data:', profileData);
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load your profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

          // Validate form data
      if (formData.skills.length === 0) {
        setError('Please add at least one skill you can offer');
        setLoading(false);
        return;
      }

      if (formData.requestedSkills.length === 0) {
        setError('Please add at least one skill you want to learn');
        setLoading(false);
        return;
      }

      if (!formData.message.trim()) {
        setError('Please add a message');
        setLoading(false);
        return;
      }

      // Validate that skills are not empty strings
      if (formData.skills.some(skill => !skill.trim())) {
        setError('Please remove empty skill entries');
        setLoading(false);
        return;
      }

      if (formData.requestedSkills.some(skill => !skill.trim())) {
        setError('Please remove empty skill entries');
        setLoading(false);
        return;
      }

    try {
      // Get user from session token
      const user = getUserFromToken();
      if (!user) {
        setError('You must be logged in to send a request');
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

      // Validate profile ID
      const profileId = parseInt(profile.id);
      if (isNaN(profileId)) {
        setError('Invalid profile ID');
        setLoading(false);
        return;
      }

      // Prepare the request data
      const requestData = {
        profileId: profileId,
        offeredSkill: formData.skills.join(', '), // Join multiple skills with comma
        requestedSkill: formData.requestedSkills.join(', '), // Join multiple skills with comma
        message: formData.message.trim()
      };

      console.log('Sending request data:', requestData);
      console.log('Request data JSON:', JSON.stringify(requestData));

      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Failed to send request';
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
        console.log('Request sent successfully:', result);
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
      console.error('Error sending request:', error);
      setError(error instanceof Error ? error.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
               <h2 className="text-xl font-bold text-gray-900">Send Request to {profile.name}</h2>
               <p className="text-sm text-gray-700">{profile.location} • {profile.yearsExperience}</p>
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
               <p className="text-green-800 text-sm">Request sent successfully! The modal will close shortly.</p>
             </div>
           )}

           {/* Loading Profile */}
           {loadingProfile && (
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <div className="flex items-center space-x-2">
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 <p className="text-blue-800 text-sm">Loading your profile...</p>
               </div>
             </div>
           )}

           {/* Skills You Can Offer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Skills You Can Offer
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSkill(e.target.value);
                      e.target.value = ''; // Reset selection
                    }
                  }}
                  disabled={loading || success || loadingProfile}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  defaultValue=""
                >
                  <option value="" disabled>Select a skill you can offer</option>
                  {userProfile?.offeredSkills?.map((offeredSkill: any, index: number) => (
                    <option key={index} value={offeredSkill.skill.name}>
                      {offeredSkill.skill.name}
                    </option>
                  )) || []}
                </select>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills You Want to Learn */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Skills You Want to Learn
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddRequestedSkill(e.target.value);
                      e.target.value = ''; // Reset selection
                    }
                  }}
                  disabled={loading || success || loadingProfile}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  defaultValue=""
                >
                  <option value="" disabled>Select a skill you want to learn</option>
                  {profile.skillsOffered.map((skill: string, index: number) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              {formData.requestedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.requestedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequestedSkill(skill)}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Message
            </h3>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              disabled={loading || success || loadingProfile}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none text-gray-800 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Introduce yourself and explain why you'd like to connect with this person..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || loadingProfile}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingProfile}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 