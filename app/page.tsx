"use client";

import React from "react";
import { RoughNotation } from "react-rough-notation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, Trophy } from "lucide-react";
import { motion } from "framer-motion";
// import { CenteredWithLogo } from "@/components/footers/centered-with-logo";

interface CommunityDashboardProps {
  className?: string;
}

const CommunityDashboard = ({ className }: CommunityDashboardProps) => {
  return (
    <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          <div className="flex-1 text-center">
            <span className="text-white text-xs font-medium">LinkIT Community</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-violet-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-violet-600">1,240</div>
            <div className="text-xs text-violet-500">Active Learners</div>
          </div>
          <div className="bg-purple-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-600">847</div>
            <div className="text-xs text-purple-500">Skills Shared</div>
          </div>
        </div>

        {/* User Cards */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">Sarah Chen</div>
              <div className="text-[10px] text-gray-500">React Developer</div>
            </div>
            <div className="flex space-x-1">
              <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[8px] rounded">JS</span>
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[8px] rounded">React</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-800">Alex Kumar</div>
              <div className="text-[10px] text-gray-500">UI/UX Designer</div>
            </div>
            <div className="flex space-x-1">
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[8px] rounded">Figma</span>
            </div>
          </div>
        </div>

        {/* Connection Requests */}
        <div className="border-t pt-2">
          <div className="text-xs font-medium text-gray-700 mb-2">New Connection Requests</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-600">Maria wants to learn React</span>
              <button className="px-2 py-1 bg-violet-500 text-white rounded text-[8px]">
                Accept
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-600">John offers Python tutoring</span>
              <button className="px-2 py-1 bg-purple-500 text-white rounded text-[8px]">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <section className="min-h-screen bg-violet-50 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-violet-200 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-purple-200 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-violet-300 rounded-full opacity-50"></div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-200 mb-6">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <span className="text-violet-700 text-sm font-medium">LinkIT Community Platform</span>
                </div>
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-slate-900">Connect, Learn, </span>
                <RoughNotation
                  type="highlight"
                  show={true}
                  color="#8b5cf6"
                  animationDelay={1000}
                  animationDuration={2000}
                  multiline
                >
                  <span className="text-slate-900">Grow Together</span>
                </RoughNotation>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Join thousands of learners sharing skills, finding mentors, and building meaningful connections in our vibrant community platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg group transition-all duration-300"
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-violet-300 text-violet-700 hover:bg-violet-50 px-8 py-4 text-lg"
              >
                Explore Community
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-violet-200"
            >
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-violet-100 rounded-full mb-2 mx-auto">
                  <Users className="h-6 w-6 text-violet-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">12K+</div>
                <div className="text-sm text-slate-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2 mx-auto">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-sm text-slate-600">Skills Shared</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-violet-100 rounded-full mb-2 mx-auto">
                  <Trophy className="h-6 w-6 text-violet-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">95%</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Mobile Mockup */}
          <div className="relative lg:pl-8">
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              {/* Phone Frame */}
              <div className="relative mx-auto w-72 h-[600px] bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
                  
                  {/* Content */}
                  <div className="pt-8 h-full">
                    <CommunityDashboard />
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -left-8 top-20 bg-white p-4 rounded-xl shadow-lg border border-violet-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-violet-600 text-sm">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Skill Match</div>
                    <div className="text-xs text-slate-500">95% compatibility</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="absolute -right-8 bottom-32 bg-white p-4 rounded-xl shadow-lg border border-purple-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">⚡</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Quick Connect</div>
                    <div className="text-xs text-slate-500">Instant messaging</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* <CenteredWithLogo /> */}
    </section>
  );
}