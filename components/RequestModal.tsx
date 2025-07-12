"use client";
import React, { useState } from 'react';
import { X, Send, User, MessageSquare, Target, Plus, X as XIcon } from 'lucide-react';

interface RequestModalProps {
  profile: {
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
  const [newSkill, setNewSkill] = useState('');
  const [newRequestedSkill, setNewRequestedSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleAddRequestedSkill = () => {
    if (newRequestedSkill.trim() && !formData.requestedSkills.includes(newRequestedSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requestedSkills: [...prev.requestedSkills, newRequestedSkill.trim()]
      }));
      setNewRequestedSkill('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Request data:', formData);
    onClose();
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

          {/* Skills You Can Offer */}
          <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-gray-800 flex items-center">
               <Target className="h-5 w-5 mr-2 text-green-600" />
               Skills You Can Offer
             </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                  placeholder="Add a skill you can teach"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
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
                <input
                  type="text"
                  value={newRequestedSkill}
                  onChange={(e) => setNewRequestedSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequestedSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                  placeholder="Add a skill you want to learn"
                />
                <button
                  type="button"
                  onClick={handleAddRequestedSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none text-gray-800 placeholder-gray-600"
              placeholder="Introduce yourself and explain why you'd like to connect with this person..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 