import React from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaUser } from 'react-icons/fa';

interface RequestDetailsModalProps {
  request: {
    id: number;
    user: {
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
    status: string;
    message: string;
    requestedAt: string;
  };
  onClose: () => void;
  type: 'incoming' | 'outgoing';
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, type }) => {
  const router = useRouter();
  
  if (!request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: FaClock, text: 'Pending' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700', icon: FaCheck, text: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: FaTimes, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-600', icon: FaClock, text: 'Unknown' };
    }
  };

  const getUserDetailsId = (userName: string) => {
    // Map user names to their corresponding IDs from the user details page
    const nameToId: { [key: string]: string } = {
      'Alex Chen': 'alex-chen',
      'Sarah Johnson': 'sarah-johnson',
      'Maria Garcia': 'maria-garcia'
    };
    return nameToId[userName] || 'alex-chen'; // fallback to alex-chen if not found
  };

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
          
          {/* Left: Avatar and Status */}
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            {request.user.avatarUrl ? (
              <img 
                src={request.user.avatarUrl} 
                alt={request.user.name} 
                className={`w-32 h-32 rounded-full object-cover border-4 ${request.user.borderColor} shadow-lg`} 
              />
            ) : (
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${request.user.borderColor} bg-gray-300 shadow-lg`}>
                {request.user.initials}
              </div>
            )}
            
            {/* Status badge */}
            <div className="mt-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium gap-2 ${getStatusConfig(request.status).color}`}>
                {React.createElement(getStatusConfig(request.status).icon, { className: "text-sm" })}
                {getStatusConfig(request.status).text}
              </span>
            </div>
          </div>
          
          {/* Right: Details */}
          <div className="flex flex-col justify-center md:w-2/3 w-full gap-4">
            <div>
              <h2 className="font-semibold text-3xl text-gray-800 mb-2">{request.user.name}</h2>
              <div className="flex items-center text-gray-600 text-lg mb-4">
                <FaMapMarkerAlt className="mr-2" />
                {request.user.location}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-2 text-yellow-500 font-semibold text-xl">
                  <FaStar className="text-xl" />
                  {request.user.rating}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  {request.user.yearsExperience}
                </span>
              </div>
            </div>

            {/* Request Message */}
            <div>
              <h3 className="text-gray-800 text-lg font-semibold mb-3">Request Message</h3>
              <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed">
                {request.message}
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <h3 className="text-gray-800 text-lg font-semibold mb-3">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {request.user.skillsOffered.map((skill, idx) => (
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
                {request.user.skillsNeeded.map((skill, idx) => (
                  <span key={idx} className="px-3 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Request Date */}
            <div className="text-gray-500 text-sm">
              Requested on: {formatDate(request.requestedAt)}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              {type === 'incoming' && request.status === 'pending' && (
                <>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-base shadow-lg transition-all">
                    Accept
                  </button>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-base shadow-lg transition-all">
                    Reject
                  </button>
                </>
              )}
              <button 
                onClick={() => {
                  onClose();
                  router.push(`/userdetails/${getUserDetailsId(request.user.name)}`);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold text-base shadow-lg transition-all flex items-center space-x-2"
              >
                <FaUser className="h-4 w-4" />
                <span>View Full Profile</span>
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

export default RequestDetailsModal; 