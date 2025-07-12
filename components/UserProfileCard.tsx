import React from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

interface UserProfileCardProps {
  name: string;
  avatarUrl?: string;
  initials: string;
  borderColor: string; // e.g. 'border-orange-400'
  location: string;
  yearsExperience: string; // e.g. '5+ years experience'
  skillsOffered: string[];
  skillsNeeded: string[];
  rating: number;
  onClick?: () => void;
  hideRequestButton?: boolean;
  status?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  avatarUrl,
  initials,
  borderColor,
  location,
  yearsExperience,
  skillsOffered,
  skillsNeeded,
  rating,
  onClick,
  hideRequestButton = false,
  status,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: FaClock, text: 'Pending' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700', icon: FaCheck, text: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: FaTimes, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: FaClock, text: 'Unknown' };
    }
  };

  return (
    <div
      className={
        "bg-white rounded-2xl border border-gray-200 shadow-md p-6 w-full max-w-xs flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer hover:ring-2 hover:ring-blue-200"
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${name}`}
    >
      {/* Top: Avatar, Name, Location */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={`w-14 h-14 rounded-full object-cover border-4 ${borderColor}`} />
        ) : (
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white border-4 ${borderColor} bg-gray-300`}>{initials}</div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-900">{name}</span>
          <span className="flex items-center text-gray-500 text-sm"><FaMapMarkerAlt className="mr-1" />{location}</span>
        </div>
      </div>
      {/* Experience badge */}
      <div className="mt-1">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium gap-1">
          {yearsExperience}
        </span>
      </div>
      {/* Skills Offered */}
      <div>
        <div className="text-gray-700 text-sm font-semibold mb-1">Skills Offered</div>
        <div className="flex flex-wrap gap-2">
          {skillsOffered.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">{skill}</span>
          ))}
          {skillsOffered.length > 3 && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">+{skillsOffered.length - 3} more</span>
          )}
        </div>
      </div>
      {/* Skills Needed */}
      <div>
        <div className="text-gray-700 text-sm font-semibold mb-1">Skills Needed</div>
        <div className="flex flex-wrap gap-2">
          {skillsNeeded.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{skill}</span>
          ))}
          {skillsNeeded.length > 2 && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">+{skillsNeeded.length - 2} more</span>
          )}
        </div>
      </div>
      {/* Bottom: Rating and Request Button/Status */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
        <span className="flex items-center gap-1 text-yellow-500 font-semibold text-base"><FaStar className="text-base" />{rating}</span>
        {hideRequestButton && status ? (
          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium gap-1 ${getStatusConfig(status).color}`}>
            {React.createElement(getStatusConfig(status).icon, { className: "text-sm" })}
            {getStatusConfig(status).text}
          </span>
        ) : (
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm shadow transition-all">Request</button>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard; 