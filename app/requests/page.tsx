"use client";
import React, { useState } from 'react';
import UserProfileCard from '../../components/UserProfileCard';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

// Sample data for requests
const incomingRequests = [
  {
    id: 1,
    user: {
      name: "Alex Chen",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      initials: "AC",
      borderColor: "border-orange-400",
      location: "San Francisco",
      yearsExperience: "5+ years experience",
      skillsOffered: ["React", "TypeScript", "Next.js", "Redux"],
      skillsNeeded: ["Machine Learning", "Python", "Go"],
      rating: 4.9,
    },
    status: "pending",
    message: "I need help with implementing a complex state management solution in React. Your experience with Redux would be perfect for this project.",
    requestedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      avatarUrl: "",
      initials: "SJ",
      borderColor: "border-purple-400",
      location: "New York",
      yearsExperience: "7+ years experience",
      skillsOffered: ["UI Design", "Figma", "Adobe XD", "Sketch"],
      skillsNeeded: ["Frontend Development", "React", "Vue.js"],
      rating: 4.8,
    },
    status: "accepted",
    message: "Looking for a UI designer to help redesign our mobile app. Your portfolio looks amazing!",
    requestedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: 3,
    user: {
      name: "Maria Garcia",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      initials: "MG",
      borderColor: "border-red-400",
      location: "Austin",
      yearsExperience: "6+ years experience",
      skillsOffered: ["Python", "Data Science", "Machine Learning", "R"],
      skillsNeeded: ["Cloud Computing", "AWS", "Azure"],
      rating: 4.9,
    },
    status: "rejected",
    message: "Need help with a machine learning project. Your data science skills would be invaluable.",
    requestedAt: "2024-01-13T09:20:00Z",
  },
];

const outgoingRequests = [
  {
    id: 4,
    user: {
      name: "David Kim",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      initials: "DK",
      borderColor: "border-blue-400",
      location: "Seattle",
      yearsExperience: "8+ years experience",
      skillsOffered: ["AWS", "Docker", "Kubernetes", "DevOps"],
      skillsNeeded: ["React", "TypeScript", "Frontend"],
      rating: 4.7,
    },
    status: "pending",
    message: "I need help with setting up a CI/CD pipeline for our React application.",
    requestedAt: "2024-01-16T14:15:00Z",
  },
  {
    id: 5,
    user: {
      name: "Emma Wilson",
      avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      initials: "EW",
      borderColor: "border-green-400",
      location: "Boston",
      yearsExperience: "4+ years experience",
      skillsOffered: ["Node.js", "Express", "MongoDB", "REST APIs"],
      skillsNeeded: ["React", "Frontend", "UI/UX"],
      rating: 4.6,
    },
    status: "accepted",
    message: "Looking for a backend developer to help build our API infrastructure.",
    requestedAt: "2024-01-15T11:00:00Z",
  },
];

// Request Status Badge Component
const RequestStatusBadge = ({ status }: { status: string }) => {
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

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${config.color}`}>
      <IconComponent className="text-xs" />
      {config.text}
    </span>
  );
};

// Request Modal Component
const RequestModal = ({ request, onClose, type }: { 
  request: typeof incomingRequests[0] | typeof outgoingRequests[0]; 
  onClose: () => void;
  type: 'incoming' | 'outgoing';
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 w-full max-w-2xl flex flex-col md:flex-row gap-8 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        
        {/* Left: User Profile */}
        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          {request.user.avatarUrl ? (
            <img src={request.user.avatarUrl} alt={request.user.name} className={`w-32 h-32 rounded-full object-cover border-4 ${request.user.borderColor}`} />
          ) : (
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${request.user.borderColor} bg-gray-300`}>
              {request.user.initials}
            </div>
          )}
          <div className="mt-4 text-center">
            <RequestStatusBadge status={request.status} />
          </div>
        </div>

        {/* Right: Request Details */}
        <div className="flex flex-col justify-center md:w-2/3 w-full gap-4">
          <div>
            <span className="font-semibold text-2xl text-gray-900 mb-1">{request.user.name}</span>
            <span className="flex items-center text-gray-500 text-base mb-2">
              <FaMapMarkerAlt className="mr-2" />
              {request.user.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium gap-1 mb-3">
              {request.user.yearsExperience}
            </span>
          </div>

          <div>
            <div className="text-gray-700 text-sm font-semibold mb-2">Request Message:</div>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
              {request.message}
            </div>
          </div>

          <div className="text-gray-500 text-xs">
            Requested on: {formatDate(request.requestedAt)}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="flex items-center gap-1 text-yellow-500 font-semibold text-lg">
              <FaStar className="text-lg" />
              {request.user.rating}
            </span>
            {type === 'incoming' && request.status === 'pending' && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm shadow transition-all">
                  Accept
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm shadow transition-all">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedRequest, setSelectedRequest] = useState<typeof incomingRequests[0] | typeof outgoingRequests[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  // Filter and search logic
  const filteredRequests = currentRequests.filter((request) => {
    const matchesSearch = 
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.skillsOffered.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      request.user.skillsNeeded.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      request.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#f5f6ff]">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Requests</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'incoming'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Incoming Requests ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'outgoing'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Outgoing Requests ({outgoingRequests.length})
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name, skills, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {currentRequests.length} requests
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="relative">
              <UserProfileCard
                {...request.user}
                onClick={() => setSelectedRequest(request)}
                hideRequestButton={true}
                status={request.status}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery || statusFilter !== 'all' ? '🔍' : '📭'}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'No matching requests found' 
                : `No ${activeTab} requests`
              }
            </h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search terms or filters."
                : activeTab === 'incoming' 
                  ? "You haven't received any requests yet." 
                  : "You haven't sent any requests yet."
              }
            </p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedRequest && (
        <RequestModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)}
          type={activeTab}
        />
      )}
    </main>
  );
} 