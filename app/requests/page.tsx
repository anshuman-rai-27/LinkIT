"use client";
import React, { useState, useEffect } from 'react';
import UserProfileCard from '../../components/UserProfileCard';
import RequestDetailsModal from '../../components/RequestDetailsModal';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { SimpleFooterWithFourGrids } from '../../components/footers/simple-footer-with-four-grids';
import { getSessionToken, getUserFromToken } from '../../lib/session';

// Request status badge component
const RequestStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: FaClock, text: 'Pending' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700', icon: FaCheck, text: 'Accepted' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: FaTimes, text: 'Rejected' };
      case 'cancelled':
        return { color: 'bg-gray-100 text-gray-700', icon: FaTimes, text: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-600', icon: FaClock, text: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium gap-1 ${config.color}`}>
      <IconComponent className="text-sm" />
      {config.text}
    </span>
  );
};

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getSessionToken();
      if (!token) {
        setError('You must be logged in to view requests');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/request', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      console.log('Fetched requests:', data);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter requests based on active tab
  const currentRequests = requests.filter(request => {
    if (activeTab === 'incoming') {
      return request.isIncoming;
    } else {
      return !request.isIncoming;
    }
  });

  // Filter and search logic
  const filteredRequests = currentRequests.filter((request) => {
    const matchesSearch = 
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.skillsOffered.some((skill: string) => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      request.user.skillsNeeded.some((skill: string) => 
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading requests...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Try Again
              </button>
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
              Incoming Requests ({currentRequests.filter(r => r.isIncoming).length})
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
              Outgoing Requests ({currentRequests.filter(r => !r.isIncoming).length})
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
                <option value="cancelled" className="bg-white">Cancelled</option>
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
          onRequestUpdate={fetchRequests}
        />
      )}
      
      {/* Footer */}
      <SimpleFooterWithFourGrids />
    </main>
  );
} 