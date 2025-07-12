"use client";
import React, { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection';
import UserProfileCard from '../../components/UserProfileCard';
import ProfileModal from '../../components/ProfileModal';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const profiles = [
  {
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
    name: "Sarah Johnson",
    avatarUrl: "",
    initials: "Sarah Jn",
    borderColor: "border-purple-400",
    location: "New York",
    yearsExperience: "7+ years experience",
    skillsOffered: ["UI Design", "Figma", "Adobe XD", "Sketch"],
    skillsNeeded: ["Frontend Development", "React", "Vue.js"],
    rating: 4.8,
  },
  {
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
  const [showCards, setShowCards] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<typeof profiles[0] | null>(null);
  useEffect(() => {
    setTimeout(() => setShowCards(true), 200);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <HeroSection />
        <section className="max-w-6xl mx-auto py-8 px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Find Your Perfect Skill Match</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
                      {profiles.map((profile, idx) => (
            <div
              key={profile.name}
              className={`transition-all duration-700 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <UserProfileCard
                {...profile}
                onClick={() => setSelectedProfile(profile)}
              />
            </div>
          ))}
          </div>
        </section>
      </div>
      {selectedProfile && (
        <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </main>
  );
} 