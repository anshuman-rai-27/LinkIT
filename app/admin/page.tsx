"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  MessageSquare, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Ban, 
  Send,
  FileText,
  BarChart3,
  Settings,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleFooterWithFourGrids } from '@/components/footers/simple-footer-with-four-grids';
import { getSessionToken } from '../../lib/session';

// Types for admin data
interface PlatformStats {
  totalUsers: number;
  totalProfiles: number;
  activeSwaps: number;
  pendingReviews: number;
  bannedUsers: number;
  totalSkills: number;
  successRate: number;
  recentUsers: any[];
  recentSwaps: any[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    createdAt: string;
    verified: boolean;
  };
  offeredSkills: any[];
  wantedSkills: any[];
}

const AdminCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  trend?: string; 
}) => (
  <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const UserCard = ({ user, onAction }: { user: User; onAction: (profileId: number, action: string) => void }) => (
  <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
          <p className="text-xs text-gray-500">{user.user.email}</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {user.role}
      </span>
    </div>
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-1">Skills Offered: {user.offeredSkills.length}</p>
      <p className="text-xs text-gray-500">Skills Needed: {user.wantedSkills.length}</p>
    </div>
    <div className="flex space-x-2">
      {user.role === 'ADMIN' ? (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => onAction(user.id, 'remove_admin')}
        >
          <UserX className="w-4 h-4 mr-1" />
          Remove Admin
        </Button>
      ) : (
        <>
          <Button 
            size="sm" 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onAction(user.id, 'ban')}
          >
            <Ban className="w-4 h-4 mr-1" />
            Ban User
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
            onClick={() => onAction(user.id, 'make_admin')}
          >
            <UserCheck className="w-4 h-4 mr-1" />
            Make Admin
          </Button>
        </>
      )}
    </div>
  </div>
);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messaging' | 'reports'>('overview');
  const [messageText, setMessageText] = useState('');
  const [selectedReport, setSelectedReport] = useState('user-activity');
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'messaging', label: 'Platform Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getSessionToken();
        if (!token) {
          setError('You must be logged in to access admin panel');
          setLoading(false);
          return;
        }

        // Fetch platform stats
        const statsResponse = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch platform stats');
        }

        const statsData = await statsResponse.json();
        setPlatformStats(statsData);

        // Fetch users
        await fetchUsers(token);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const fetchUsers = async (token: string, page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (userSearch) params.append('search', userSearch);
      if (userRole) params.append('role', userRole);

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  const handleUserAction = async (profileId: number, action: string) => {
    try {
      const token = getSessionToken();
      if (!token) return;

      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileId, action })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh users list
      await fetchUsers(token, currentPage);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const handleSendMessage = async () => {
    try {
      const token = getSessionToken();
      if (!token) return;

      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messageType: 'General Announcement',
          message: messageText,
          targetUsers: null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessageText('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage platform operations and user safety</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Admin Access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'messaging' | 'reports')}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading admin data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : platformStats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <AdminCard
                    title="Total Users"
                    value={platformStats.totalUsers.toLocaleString()}
                    icon={Users}
                    color="bg-blue-500"
                    trend="+12% this month"
                  />
                  <AdminCard
                    title="Active Swaps"
                    value={platformStats.activeSwaps}
                    icon={Clock}
                    color="bg-green-500"
                    trend="+8% this week"
                  />
                  <AdminCard
                    title="Pending Reviews"
                    value={platformStats.pendingReviews}
                    icon={AlertTriangle}
                    color="bg-yellow-500"
                  />
                  <AdminCard
                    title="Total Skills"
                    value={platformStats.totalSkills}
                    icon={FileText}
                    color="bg-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {platformStats.recentUsers.slice(0, 3).map((user: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New user registration</p>
                            <p className="text-xs text-gray-500">{user.profile?.name || user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Swaps</h3>
                    <div className="space-y-4">
                      {platformStats.recentSwaps.slice(0, 3).map((swap: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Swap {swap.status.toLowerCase()}</p>
                            <p className="text-xs text-gray-500">
                              {swap.fromProfile.name} → {swap.toProfile.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-purple-300 text-purple-600">
                  <Users className="w-4 h-4 mr-2" />
                  View All Users
                </Button>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export Users
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button 
                onClick={() => {
                  const token = getSessionToken();
                  if (token) fetchUsers(token, 1);
                }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Search
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.map((user: User) => (
                  <UserCard key={user.id} user={user} onAction={handleUserAction} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      const token = getSessionToken();
                      if (token) fetchUsers(token, currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => {
                      const token = getSessionToken();
                      if (token) fetchUsers(token, currentPage + 1);
                    }}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'messaging' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Platform Messages</h2>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Platform Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900">
                      <option>Feature Update</option>
                      <option>Downtime Alert</option>
                      <option>Maintenance Notice</option>
                      <option>General Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your platform message here..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="bg-purple-500 hover:bg-purple-600"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to All Users
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Feature Update</span>
                      <span className="text-xs text-blue-600">2 hours ago</span>
                    </div>
                    <p className="text-sm text-blue-700">New skill matching algorithm has been deployed!</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Maintenance Notice</span>
                      <span className="text-xs text-yellow-600">1 day ago</span>
                    </div>
                    <p className="text-sm text-yellow-700">Scheduled maintenance on Sunday 2-4 AM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select 
                      value={selectedReport}
                      onChange={(e) => setSelectedReport(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="user-activity">User Activity Report</option>
                      <option value="swap-stats">Swap Statistics</option>
                      <option value="feedback-logs">Feedback Logs</option>
                      <option value="moderation-actions">Moderation Actions</option>
                      <option value="platform-usage">Platform Usage Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last year</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">New Users</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">+156</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Successful Swaps</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">+89</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Ban className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Banned Users</span>
                    </div>
                    <span className="text-lg font-semibold text-red-600">+3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <SimpleFooterWithFourGrids />
    </div>
  );
}
