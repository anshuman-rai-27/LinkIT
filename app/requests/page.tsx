"use client";
import React, { useState, useEffect } from 'react';
import UserProfileCard from '../../components/UserProfileCard';
import RequestDetailsModal from '../../components/RequestDetailsModal';
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
  {
    id: 4,
    user: {
      name: "James Wilson",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      initials: "JW",
      borderColor: "border-blue-400",
      location: "Seattle",
      yearsExperience: "8+ years experience",
      skillsOffered: ["AWS", "Docker", "Kubernetes", "DevOps"],
      skillsNeeded: ["React", "TypeScript", "Frontend"],
      rating: 4.7,
    },
    status: "pending",
    message: "Looking for a DevOps engineer to help set up our CI/CD pipeline. Your AWS experience is exactly what we need.",
    requestedAt: "2024-01-12T14:20:00Z",
  },
  {
    id: 5,
    user: {
      name: "Emily Davis",
      avatarUrl: "https://randomuser.me/api/portraits/women/23.jpg",
      initials: "ED",
      borderColor: "border-green-400",
      location: "Boston",
      yearsExperience: "4+ years experience",
      skillsOffered: ["Node.js", "Express", "MongoDB", "REST APIs"],
      skillsNeeded: ["React", "Frontend", "UI/UX"],
      rating: 4.6,
    },
    status: "accepted",
    message: "Need a backend developer to help build our API infrastructure. Your Node.js skills are perfect!",
    requestedAt: "2024-01-11T11:15:00Z",
  },
  {
    id: 6,
    user: {
      name: "Michael Brown",
      avatarUrl: "https://randomuser.me/api/portraits/men/89.jpg",
      initials: "MB",
      borderColor: "border-yellow-400",
      location: "Chicago",
      yearsExperience: "9+ years experience",
      skillsOffered: ["Java", "Spring Boot", "Microservices", "Kafka"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
    },
    status: "pending",
    message: "Looking for a Java developer to help with our microservices architecture. Your Spring Boot experience is valuable.",
    requestedAt: "2024-01-10T16:45:00Z",
  },
  {
    id: 7,
    user: {
      name: "Lisa Anderson",
      avatarUrl: "https://randomuser.me/api/portraits/women/56.jpg",
      initials: "LA",
      borderColor: "border-pink-400",
      location: "Denver",
      yearsExperience: "6+ years experience",
      skillsOffered: ["Vue.js", "JavaScript", "CSS", "Webpack"],
      skillsNeeded: ["Python", "Django", "Backend"],
      rating: 4.7,
    },
    status: "rejected",
    message: "Need a frontend developer with Vue.js experience. Your portfolio shows great work!",
    requestedAt: "2024-01-09T13:30:00Z",
  },
  {
    id: 8,
    user: {
      name: "Robert Taylor",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      initials: "RT",
      borderColor: "border-indigo-400",
      location: "Miami",
      yearsExperience: "7+ years experience",
      skillsOffered: ["Angular", "TypeScript", "RxJS", "NgRx"],
      skillsNeeded: ["Node.js", "Express", "Backend"],
      rating: 4.9,
    },
    status: "accepted",
    message: "Looking for an Angular developer to help with our enterprise application. Your TypeScript skills are impressive.",
    requestedAt: "2024-01-08T10:20:00Z",
  },
  {
    id: 9,
    user: {
      name: "Jennifer Lee",
      avatarUrl: "https://randomuser.me/api/portraits/women/78.jpg",
      initials: "JL",
      borderColor: "border-teal-400",
      location: "Portland",
      yearsExperience: "5+ years experience",
      skillsOffered: ["GraphQL", "Apollo", "React", "TypeScript"],
      skillsNeeded: ["Python", "FastAPI", "Backend"],
      rating: 4.6,
    },
    status: "pending",
    message: "Need help with GraphQL implementation. Your Apollo experience would be perfect for our project.",
    requestedAt: "2024-01-07T15:10:00Z",
  },
  {
    id: 10,
    user: {
      name: "David Martinez",
      avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg",
      initials: "DM",
      borderColor: "border-cyan-400",
      location: "Phoenix",
      yearsExperience: "8+ years experience",
      skillsOffered: ["Go", "Docker", "Kubernetes", "gRPC"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
    },
    status: "accepted",
    message: "Looking for a Go developer to help with our microservices. Your gRPC experience is exactly what we need.",
    requestedAt: "2024-01-06T12:45:00Z",
  },
  {
    id: 11,
    user: {
      name: "Amanda White",
      avatarUrl: "https://randomuser.me/api/portraits/women/91.jpg",
      initials: "AW",
      borderColor: "border-rose-400",
      location: "Nashville",
      yearsExperience: "4+ years experience",
      skillsOffered: ["Svelte", "JavaScript", "CSS", "Vite"],
      skillsNeeded: ["Python", "Django", "Backend"],
      rating: 4.5,
    },
    status: "rejected",
    message: "Need a Svelte developer for our new project. Your modern frontend skills are impressive!",
    requestedAt: "2024-01-05T09:30:00Z",
  },
  {
    id: 12,
    user: {
      name: "Christopher Clark",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
      initials: "CC",
      borderColor: "border-emerald-400",
      location: "Las Vegas",
      yearsExperience: "10+ years experience",
      skillsOffered: ["Rust", "Systems Programming", "C++", "Assembly"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.9,
    },
    status: "pending",
    message: "Looking for a Rust developer for our systems programming project. Your low-level experience is valuable.",
    requestedAt: "2024-01-04T14:15:00Z",
  },
];

const outgoingRequests = [
  {
    id: 13,
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
    id: 14,
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
  {
    id: 15,
    user: {
      name: "Sophie Chen",
      avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      initials: "SC",
      borderColor: "border-purple-400",
      location: "Los Angeles",
      yearsExperience: "6+ years experience",
      skillsOffered: ["Python", "Django", "PostgreSQL", "Redis"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
    },
    status: "rejected",
    message: "Need a Python developer to help with our Django backend. Your experience is perfect!",
    requestedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: 16,
    user: {
      name: "Ryan Thompson",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      initials: "RT",
      borderColor: "border-orange-400",
      location: "Austin",
      yearsExperience: "7+ years experience",
      skillsOffered: ["React Native", "Mobile Development", "Firebase", "Redux"],
      skillsNeeded: ["Node.js", "Backend", "API Development"],
      rating: 4.7,
    },
    status: "pending",
    message: "Looking for a React Native developer for our mobile app. Your mobile experience is valuable.",
    requestedAt: "2024-01-13T16:45:00Z",
  },
  {
    id: 17,
    user: {
      name: "Natalie Rodriguez",
      avatarUrl: "https://randomuser.me/api/portraits/women/89.jpg",
      initials: "NR",
      borderColor: "border-pink-400",
      location: "San Diego",
      yearsExperience: "5+ years experience",
      skillsOffered: ["Vue.js", "Nuxt.js", "Vuetify", "TypeScript"],
      skillsNeeded: ["Python", "FastAPI", "Backend"],
      rating: 4.6,
    },
    status: "accepted",
    message: "Need a Vue.js developer to help with our frontend. Your Nuxt.js experience is impressive!",
    requestedAt: "2024-01-12T13:20:00Z",
  },
  {
    id: 18,
    user: {
      name: "Kevin Johnson",
      avatarUrl: "https://randomuser.me/api/portraits/men/23.jpg",
      initials: "KJ",
      borderColor: "border-teal-400",
      location: "Dallas",
      yearsExperience: "9+ years experience",
      skillsOffered: ["C#", ".NET", "Azure", "SQL Server"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.9,
    },
    status: "pending",
    message: "Looking for a .NET developer to help with our enterprise application. Your Azure experience is valuable.",
    requestedAt: "2024-01-11T10:15:00Z",
  },
  {
    id: 19,
    user: {
      name: "Isabella Garcia",
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      initials: "IG",
      borderColor: "border-indigo-400",
      location: "Phoenix",
      yearsExperience: "4+ years experience",
      skillsOffered: ["Flutter", "Dart", "Firebase", "Mobile UI"],
      skillsNeeded: ["Node.js", "Express", "Backend"],
      rating: 4.5,
    },
    status: "rejected",
    message: "Need a Flutter developer for our cross-platform app. Your mobile development skills are great!",
    requestedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: 20,
    user: {
      name: "Marcus Davis",
      avatarUrl: "https://randomuser.me/api/portraits/men/78.jpg",
      initials: "MD",
      borderColor: "border-cyan-400",
      location: "Houston",
      yearsExperience: "8+ years experience",
      skillsOffered: ["PHP", "Laravel", "MySQL", "Redis"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
    },
    status: "accepted",
    message: "Looking for a Laravel developer to help with our backend. Your PHP experience is perfect!",
    requestedAt: "2024-01-09T11:45:00Z",
  },
  {
    id: 21,
    user: {
      name: "Olivia Taylor",
      avatarUrl: "https://randomuser.me/api/portraits/women/56.jpg",
      initials: "OT",
      borderColor: "border-rose-400",
      location: "Denver",
      yearsExperience: "6+ years experience",
      skillsOffered: ["Svelte", "SvelteKit", "TypeScript", "Tailwind CSS"],
      skillsNeeded: ["Python", "Django", "Backend"],
      rating: 4.7,
    },
    status: "pending",
    message: "Need a Svelte developer for our modern frontend. Your SvelteKit experience is impressive!",
    requestedAt: "2024-01-08T15:20:00Z",
  },
  {
    id: 22,
    user: {
      name: "Daniel Lee",
      avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg",
      initials: "DL",
      borderColor: "border-emerald-400",
      location: "Miami",
      yearsExperience: "7+ years experience",
      skillsOffered: ["Ruby", "Rails", "PostgreSQL", "Redis"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.6,
    },
    status: "accepted",
    message: "Looking for a Ruby on Rails developer. Your Rails experience would be perfect for our project.",
    requestedAt: "2024-01-07T12:10:00Z",
  },
  {
    id: 23,
    user: {
      name: "Ava Martinez",
      avatarUrl: "https://randomuser.me/api/portraits/women/91.jpg",
      initials: "AM",
      borderColor: "border-yellow-400",
      location: "Portland",
      yearsExperience: "5+ years experience",
      skillsOffered: ["Elixir", "Phoenix", "PostgreSQL", "WebSocket"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.5,
    },
    status: "rejected",
    message: "Need an Elixir developer for our real-time application. Your Phoenix experience is valuable.",
    requestedAt: "2024-01-06T09:40:00Z",
  },
  {
    id: 24,
    user: {
      name: "Lucas Anderson",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
      initials: "LA",
      borderColor: "border-violet-400",
      location: "Nashville",
      yearsExperience: "10+ years experience",
      skillsOffered: ["Scala", "Akka", "Kafka", "Spark"],
      skillsNeeded: ["React", "JavaScript", "Frontend"],
      rating: 4.9,
    },
    status: "pending",
    message: "Looking for a Scala developer for our data processing pipeline. Your Akka experience is valuable.",
    requestedAt: "2024-01-05T13:25:00Z",
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



export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedRequest, setSelectedRequest] = useState<typeof incomingRequests[0] | typeof outgoingRequests[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTab]);

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" suppressHydrationWarning>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800 bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Requests
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="backdrop-blur-md bg-white/60 rounded-2xl p-1 shadow-xl border border-white/40">
            <button
              key="incoming-tab"
              onClick={() => setActiveTab('incoming')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'incoming'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
              }`}
            >
              Incoming Requests ({incomingRequests.length})
            </button>
            <button
              key="outgoing-tab"
              onClick={() => setActiveTab('outgoing')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'outgoing'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
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
                className="w-full px-4 py-3 pl-12 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-gray-800 placeholder-gray-500"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
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
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-gray-800"
              >
                <option value="all" className="bg-white">All Status</option>
                <option value="pending" className="bg-white">Pending</option>
                <option value="accepted" className="bg-white">Accepted</option>
                <option value="rejected" className="bg-white">Rejected</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors backdrop-blur-md bg-white/60 rounded-xl border border-white/40 hover:bg-white/80"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} requests
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRequests.map((request) => (
            <UserProfileCard
              key={request.id}
              {...request.user}
              status={request.status}
              hideRequestButton={true}
              onClick={() => setSelectedRequest(request)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <div className="backdrop-blur-md bg-white/60 rounded-2xl p-2 shadow-xl border border-white/40">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!shouldShow) {
                      // Show ellipsis if there's a gap
                      const prevPage = page - 1;
                      const shouldShowEllipsis = 
                        prevPage === 1 || 
                        (prevPage >= currentPage - 1 && prevPage <= currentPage + 1);
                      
                      if (!shouldShowEllipsis) {
                        return null;
                      }
                      return (
                        <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-50">
              {searchQuery || statusFilter !== 'all' ? '🔍' : '📭'}
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'No matching requests found' 
                : `No ${activeTab} requests`
              }
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search terms or filters."
                : activeTab === 'incoming' 
                  ? "You haven't received any requests yet." 
                  : "You haven't sent any requests yet."
              }
            </p>
          </div>
        )}

        {/* No Results on Current Page */}
        {filteredRequests.length > 0 && paginatedRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-50">📄</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No results on this page
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try going back to the first page or adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)}
          type={activeTab}
        />
      )}
    </main>
  );
} 