import React from 'react';
import { FaStar, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

interface ProfileModalProps {
  profile: {
    name: string;
    avatarUrl?: string;
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

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
        
        {/* Modal content */}
        <div className="relative backdrop-blur-md bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 animate-fadeIn">
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors z-10"
          >
            <FaTimes />
          </button>
          
          {/* Left: Avatar */}
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className={`w-32 h-32 rounded-full object-cover border-4 ${profile.borderColor} shadow-lg`} 
              />
            ) : (
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${profile.borderColor} bg-gray-300 shadow-lg`}>
                {profile.initials}
              </div>
            )}
            
            {/* Experience badge */}
            <div className="mt-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                {profile.yearsExperience}
              </span>
            </div>
          </div>
          
          {/* Right: Details */}
          <div className="flex flex-col justify-center md:w-2/3 w-full gap-4">
            <div>
              <h2 className="font-semibold text-3xl text-gray-800 mb-2">{profile.name}</h2>
              <div className="flex items-center text-gray-600 text-lg mb-4">
                <FaMapMarkerAlt className="mr-2" />
                {profile.location}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center gap-2 text-yellow-500 font-semibold text-xl">
                  <FaStar className="text-xl" />
                  {profile.rating}
                </span>
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <h3 className="text-gray-800 text-lg font-semibold mb-3">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered.map((skill, idx) => (
                  <span key={idx} className="px-3 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Needed */}
            <div>
              <h3 className="text-gray-800 text-lg font-semibold mb-3">Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsNeeded.map((skill, idx) => (
                  <span key={idx} className="px-3 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold text-base shadow-lg transition-all">
                Request
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 