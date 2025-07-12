"use client";
import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setShow(true);
  }, []);

  // Prevent hydration mismatch by showing a consistent initial state
  if (!isMounted) {
    return (
      <section className="relative flex flex-col items-center justify-center py-20 md:py-32 bg-gradient-to-br from-white to-[#f5f6ff] overflow-hidden opacity-0 translate-y-8">
        {/* Blurred background blobs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-200 rounded-full opacity-40 blur-3xl z-0" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-200 rounded-full opacity-40 blur-3xl z-0" />
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Exchange Skills
          </h1>
          <h2 className="text-4xl md:text-6xl font-extrabold text-center text-gray-900 mb-4">
            Build Dreams
          </h2>
          <p className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mb-10">
            Connect with talented individuals, trade your expertise, and grow together in a collaborative community of makers and creators.
          </p>
          {/* Search/filter bar */}
          <div className="flex flex-col md:flex-row items-center gap-3 bg-white/90 shadow-lg rounded-2xl px-6 py-4 w-full max-w-3xl mb-4">
            <div className="flex items-center w-full md:w-auto flex-1">
              <span className="material-icons text-gray-400 mr-2">search</span>
              <input
                type="text"
                placeholder="What skill are you looking for? (e.g., UX Design)"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                suppressHydrationWarning
              />
            </div>
            <div className="flex items-center w-full md:w-auto flex-1">
              <span className="material-icons text-gray-400 mr-2">location_on</span>
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                suppressHydrationWarning
              />
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-pink-600 hover:to-purple-600 transition-all mr-2" suppressHydrationWarning>
              Filters
            </button>
            <button className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-blue-500 hover:to-cyan-500 transition-all" suppressHydrationWarning>
              Search
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative flex flex-col items-center justify-center py-20 md:py-32 bg-gradient-to-br from-white to-[#f5f6ff] overflow-hidden transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
      {/* Blurred background blobs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-200 rounded-full opacity-40 blur-3xl z-0" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-200 rounded-full opacity-40 blur-3xl z-0" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Exchange Skills
        </h1>
        <h2 className="text-4xl md:text-6xl font-extrabold text-center text-gray-900 mb-4">
          Build Dreams
        </h2>
        <p className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mb-10">
          Connect with talented individuals, trade your expertise, and grow together in a collaborative community of makers and creators.
        </p>
        {/* Search/filter bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white/90 shadow-lg rounded-2xl px-6 py-4 w-full max-w-3xl mb-4">
          <div className="flex items-center w-full md:w-auto flex-1">
            <span className="material-icons text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="What skill are you looking for? (e.g., UX Design)"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              suppressHydrationWarning
            />
          </div>
          <div className="flex items-center w-full md:w-auto flex-1">
            <span className="material-icons text-gray-400 mr-2">location_on</span>
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              suppressHydrationWarning
            />
          </div>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-pink-600 hover:to-purple-600 transition-all mr-2" suppressHydrationWarning>
            Filters
          </button>
          <button className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-blue-500 hover:to-cyan-500 transition-all" suppressHydrationWarning>
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 