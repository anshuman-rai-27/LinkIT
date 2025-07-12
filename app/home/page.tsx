"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '../../components/HeroSection';
import UserProfileCard from '../../components/UserProfileCard';
import { FaStar, FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { SimpleFooterWithFourGrids } from '../../components/footers/simple-footer-with-four-grids';

const profiles = [
  {
    id: "alex-chen",
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
  {
    id: "sarah-johnson",
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
  {
    id: "maria-garcia",
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
];

export default function HomePage() {
  const router = useRouter();
  const [showCards, setShowCards] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkillOffered, setFilterSkillOffered] = useState('');
  const [filterSkillNeeded, setFilterSkillNeeded] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Collect all unique skills for dropdowns
  const allSkillsOffered = Array.from(new Set(profiles.flatMap(p => p.skillsOffered)));
  const allSkillsNeeded = Array.from(new Set(profiles.flatMap(p => p.skillsNeeded)));

  // Filtering logic
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.skillsNeeded.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesOffered = filterSkillOffered ? profile.skillsOffered.includes(filterSkillOffered) : true;
    const matchesNeeded = filterSkillNeeded ? profile.skillsNeeded.includes(filterSkillNeeded) : true;
    return matchesSearch && matchesOffered && matchesNeeded;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setShowCards(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Reset to first page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSkillOffered, filterSkillNeeded]);

  // Prevent hydration mismatch by showing a loading state initially
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10">
          <HeroSection />
          <section className="max-w-6xl mx-auto py-8 px-4">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-800 bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Find Your Perfect Skill Match</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              {profiles.map((profile, idx) => (
                <div key={profile.name} className="opacity-0">
                  <UserProfileCard {...profile} onClick={() => {}} />
                </div>
              ))}
            </div>
          </section>
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

      <div className="relative z-10">
        <HeroSection />
        {/* Search/Filter Bar */}
        <section className="max-w-6xl mx-auto pt-8 px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-gray-800 placeholder-gray-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-2">
              <select
                value={filterSkillOffered}
                onChange={e => setFilterSkillOffered(e.target.value)}
                className="px-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-gray-800"
              >
                <option value="">All Skills Offered</option>
                {allSkillsOffered.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <select
                value={filterSkillNeeded}
                onChange={e => setFilterSkillNeeded(e.target.value)}
                className="px-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all text-gray-800"
              >
                <option value="">All Skills Needed</option>
                {allSkillsNeeded.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              {(searchQuery || filterSkillOffered || filterSkillNeeded) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterSkillOffered('');
                    setFilterSkillNeeded('');
                  }}
                  className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors backdrop-blur-md bg-white/60 rounded-xl border border-white/40 hover:bg-white/80"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto pb-12 px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-800 bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Find Your Perfect Skill Match</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {paginatedProfiles.length === 0 ? (
              <div className="text-center w-full py-16 text-gray-500">No profiles found.</div>
            ) : (
              paginatedProfiles.map((profile, idx) => (
                <div
                  key={profile.name}
                  className={`transition-all duration-700 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <UserProfileCard
                    {...profile}
                    onClick={() => router.push(`/userdetails/${profile.id}`)}
                    hideRequestButton={true}
                  />
                </div>
              ))
            )}
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
        </section>
      </div>
      
      {/* Footer */}
      <SimpleFooterWithFourGrids />
    </main>
  );
} 