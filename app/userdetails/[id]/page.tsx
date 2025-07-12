"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaMapMarkerAlt, FaArrowLeft, FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import RequestModal from '../../../components/RequestModal';
import RatingModal from '../../../components/RatingModal';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data && Object.keys(data).length > 0) {
            setUser(data);
          } else {
            setError('User not found');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setError('Failed to load user profile');
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading profile...</h1>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'User not found'}</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>Back to Explore</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  {/* Avatar and Basic Info */}
                  <div className="text-center mb-6">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className={`w-32 h-32 rounded-full object-cover border-4 ${user.borderColor} mx-auto mb-4 shadow-lg`} 
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${user.borderColor} bg-gray-300 shadow-lg mx-auto mb-4`}>
                        {user.initials}
                      </div>
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                    <div className="flex items-center justify-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2" />
                      {user.location}
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="flex items-center gap-2 text-yellow-500 font-semibold text-xl">
                        <FaStar className="text-xl" />
                        {user.rating}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                        {user.yearsExperience}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaUser className="mr-2" />
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
                    <p className="text-gray-700 mb-2">{user.availability}</p>
                    <p className="text-sm text-gray-600">Timezone: {user.timezone}</p>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.languages.map((language: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Send Connection Request</span>
                    </button>
                    
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold text-base shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <FaStar className="h-4 w-4" />
                      <span>Rate & Review</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Skills and Projects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills Offered */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Offered</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsOffered.map((skill: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Needed */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Looking For</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsNeeded.map((skill: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Projects</h2>
                  <div className="space-y-6">
                    {user.projects.map((project: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 bg-white/50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech: string, techIdx: number) => (
                            <span key={techIdx} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal 
          profile={user} 
          onClose={() => setShowRequestModal(false)} 
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal 
          profile={user} 
          onClose={() => setShowRatingModal(false)} 
        />
      )}
    </div>
  );
} 