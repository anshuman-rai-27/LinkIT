"use client";

import React from "react";
import { RoughNotation } from "react-rough-notation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, Trophy, MessageCircle, Shield, Zap, Star, ChevronDown, ChevronUp, Sparkles, CheckCircle, Globe, Heart, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import { CenteredWithLogo } from "@/components/footers/centered-with-logo";
import { FooterWithGrid } from "@/components/footers/footer-with-grid";
import { SimpleFooterWithFourGrids } from "@/components/footers/simple-footer-with-four-grids";

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

// Enhanced FAQ Component with Aceternity styling
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-violet-200 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
      <button
        className="flex justify-between items-center w-full p-6 text-left hover:bg-violet-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-slate-900 pr-4">{question}</span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-violet-600 transition-transform" />
          ) : (
            <ChevronDown className="h-5 w-5 text-violet-600 transition-transform" />
          )}
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <p className="text-slate-600 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Testimonial Component
const TestimonialCard = ({ 
  name, 
  role, 
  content, 
  avatar, 
  rating 
}: { 
  name: string; 
  role: string; 
  content: string; 
  avatar: string; 
  rating: number; 
}) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-violet-100">
        <div className="flex items-center mb-6">
          <div className="flex space-x-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg italic">"{content}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full mr-4 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900">{name}</div>
            <div className="text-sm text-slate-500">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  gradient: string; 
}) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-1 ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
      <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-violet-100 hover:shadow-2xl transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  icon: Icon, 
  number, 
  label, 
  gradient 
}: { 
  icon: any; 
  number: string; 
  label: string; 
  gradient: string; 
}) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-1 ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
      <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-violet-100 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-2">{number}</div>
        <div className="text-sm text-slate-600">{label}</div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
                  className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg group transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-violet-300 text-violet-700  bg-violet-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl"
                >
                  Explore Community
                </Button>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <StatsCard
                  icon={Users}
                  number="12K+"
                  label="Active Members"
                  gradient="from-violet-600 to-purple-600"
                />
                <StatsCard
                  icon={Lightbulb}
                  number="500+"
                  label="Skills Shared"
                  gradient="from-purple-600 to-violet-600"
                />
                <StatsCard
                  icon={Trophy}
                  number="95%"
                  label="Success Rate"
                  gradient="from-violet-600 to-purple-600"
                />
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
                  className="absolute -left-8 top-20 bg-white p-4 rounded-xl shadow-lg border border-violet-100 backdrop-blur-sm"
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
                  className="absolute -right-8 bottom-32 bg-white p-4 rounded-xl shadow-lg border border-purple-100 backdrop-blur-sm"
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
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-violet-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-violet-700 text-sm font-medium">Why Choose LinkIT?</span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our platform offers cutting-edge features designed to create meaningful connections and accelerate your learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Target}
                title="Smart Matching"
                description="Our AI-powered algorithm connects you with the perfect mentors and learners based on your skills, goals, and learning preferences."
                gradient="from-violet-600 to-purple-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Shield}
                title="Safe & Secure"
                description="Your privacy and security are our top priorities. Connect with confidence in our verified community with end-to-end encryption."
                gradient="from-purple-600 to-violet-600"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Zap}
                title="Instant Learning"
                description="Start learning immediately with our real-time messaging, video calls, screen sharing, and collaborative tools."
                gradient="from-violet-600 to-purple-600"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-violet-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-violet-600" />
              <span className="text-violet-700 text-sm font-medium">Community Love</span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              What Our Community
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> Says</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied learners who have transformed their skills and careers through LinkIT.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                name="Sarah Chen"
                role="React Developer"
                content="LinkIT helped me find the perfect mentor for React development. The community is incredibly supportive and I've learned so much in just a few months. The skill matching is spot-on!"
                avatar="/avatar1.jpg"
                rating={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                name="Alex Kumar"
                role="UI/UX Designer"
                content="The skill matching algorithm is amazing! I connected with designers who shared exactly what I needed to learn. The platform is intuitive and the community is genuinely helpful."
                avatar="/avatar2.jpg"
                rating={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                name="Maria Rodriguez"
                role="Python Developer"
                content="I've been teaching Python on LinkIT for over a year now. The platform makes it so easy to connect with eager learners and share knowledge. It's rewarding to see others grow!"
                avatar="/avatar3.jpg"
                rating={5}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-violet-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full mb-6">
              <Globe className="h-4 w-4 text-violet-600" />
              <span className="text-violet-700 text-sm font-medium">Got Questions?</span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about LinkIT and how to get started on your learning journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-4">
              <FAQItem
                question="How does the skill matching algorithm work?"
                answer="Our advanced AI algorithm analyzes your profile, skills, learning goals, and preferences to connect you with the most compatible mentors and learners in our community. It considers factors like skill level, availability, teaching style, and learning objectives."
              />
              <FAQItem
                question="Is LinkIT completely free to use?"
                answer="Yes! LinkIT offers a generous free tier with access to core features including skill matching, messaging, and community access. We also offer premium plans with advanced features like unlimited connections, priority support, and exclusive workshops."
              />
              <FAQItem
                question="How do I verify my skills on the platform?"
                answer="You can verify your skills through multiple methods: our comprehensive assessment system, portfolio uploads, professional certifications, or by getting endorsements from other verified community members. This helps maintain quality and trust."
              />
              <FAQItem
                question="Can I both teach and learn on LinkIT simultaneously?"
                answer="Absolutely! Many of our members both teach skills they're expert in and learn new skills from others. It's a two-way learning experience that creates a vibrant, collaborative community where everyone can contribute and grow."
              />
              <FAQItem
                question="What happens if I don't find a good match initially?"
                answer="Our matching system continuously learns and improves based on user feedback. If you don't find a good match initially, we'll keep looking and notify you when better matches become available. You can also adjust your preferences anytime."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-violet-500 via-purple-600 to-violet-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Ready to Start?</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Start Your Learning
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> Journey Today</span>
            </h2>
            <p className="text-xl text-violet-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners and mentors who are already transforming their skills and building meaningful connections in our vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-violet-50 px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooterWithFourGrids />
    </div>
  );
}