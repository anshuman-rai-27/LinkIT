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
      </div>
    </section>
  );
};

export default HeroSection; 