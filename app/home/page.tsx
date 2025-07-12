"use client";
import React, { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection';
import UserProfileCard from '../../components/UserProfileCard';
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

function ProfileModal({ profile, onClose }: { profile: typeof profiles[0]; onClose: () => void }) {
  if (!profile) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 w-full max-w-2xl flex flex-col md:flex-row gap-8 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {/* Left: Avatar */}
        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className={`w-32 h-32 rounded-full object-cover border-4 ${profile.borderColor}`} />
          ) : (
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${profile.borderColor} bg-gray-300`}>
              {profile.initials}
            </div>
          )}
        </div>
        {/* Right: Details */}
        <div className="flex flex-col justify-center md:w-2/3 w-full gap-2">
          <span className="font-semibold text-2xl text-gray-900 mb-1">{profile.name}</span>
          <span className="flex items-center text-gray-500 text-base mb-1"><FaMapMarkerAlt className="mr-2" />{profile.location}</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium gap-1 mb-2">
            {profile.yearsExperience}
          </span>
          <div className="text-gray-700 text-sm font-semibold mb-1 mt-2">All Skills Offered</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.skillsOffered.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">{skill}</span>
            ))}
          </div>
          <div className="text-gray-700 text-sm font-semibold mb-1 mt-2">All Skills Needed</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.skillsNeeded.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{skill}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="flex items-center gap-1 text-yellow-500 font-semibold text-lg"><FaStar className="text-lg" />{profile.rating}</span>
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-base shadow transition-all">Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showCards, setShowCards] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<typeof profiles[0] | null>(null);
  useEffect(() => {
    setTimeout(() => setShowCards(true), 200);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#f5f6ff]">
      <HeroSection />
      <section className="max-w-6xl mx-auto py-8">
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
      {selectedProfile && (
        <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </main>
  );
} 