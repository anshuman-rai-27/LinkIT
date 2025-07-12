"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaMapMarkerAlt, FaArrowLeft, FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import RequestModal from '../../../components/RequestModal';

// Sample user data - in a real app, this would come from an API
const userData = {
  "alex-chen": {
    name: "Alex Chen",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    initials: "AC",
    borderColor: "border-orange-400",
    location: "San Francisco",
    yearsExperience: "5+ years experience",
    skillsOffered: ["React", "TypeScript", "Next.js", "Redux", "Node.js", "Express"],
    skillsNeeded: ["Machine Learning", "Python", "Go", "Docker"],
    rating: 4.9,
    bio: "Frontend developer with a passion for creating intuitive user experiences. I specialize in React and TypeScript, and I'm always eager to learn new technologies. Currently working on a large-scale e-commerce platform.",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution using React, Node.js, and MongoDB",
        tech: ["React", "Node.js", "MongoDB", "Stripe"]
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        tech: ["React", "Socket.io", "Express", "PostgreSQL"]
      }
    ],
    availability: "Available for mentoring and collaboration",
    timezone: "PST (UTC-8)",
    languages: ["English", "Mandarin"]
  },
  "sarah-johnson": {
    name: "Sarah Johnson",
    avatarUrl: "",
    initials: "SJ",
    borderColor: "border-purple-400",
    location: "New York",
    yearsExperience: "7+ years experience",
    skillsOffered: ["UI Design", "Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    skillsNeeded: ["Frontend Development", "React", "Vue.js", "JavaScript"],
    rating: 4.8,
    bio: "Senior UI/UX designer with expertise in creating beautiful and functional interfaces. I've worked with startups and enterprise companies, helping them build products that users love.",
    projects: [
      {
        name: "Mobile Banking App",
        description: "Redesigned the user interface for a major banking application",
        tech: ["Figma", "Sketch", "InVision", "Principle"]
      },
      {
        name: "E-learning Platform",
        description: "Created the complete design system and user experience for an online learning platform",
        tech: ["Figma", "Adobe XD", "Lottie", "After Effects"]
      }
    ],
    availability: "Available for design consultations and mentorship",
    timezone: "EST (UTC-5)",
    languages: ["English", "Spanish"]
  },
  "maria-garcia": {
    name: "Maria Garcia",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    initials: "MG",
    borderColor: "border-red-400",
    location: "Austin",
    yearsExperience: "6+ years experience",
    skillsOffered: ["Python", "Data Science", "Machine Learning", "R", "TensorFlow", "Pandas"],
    skillsNeeded: ["Cloud Computing", "AWS", "Azure", "Docker"],
    rating: 4.9,
    bio: "Data scientist and machine learning engineer with a background in statistics and computer science. I love solving complex problems and building predictive models that drive business value.",
    projects: [
      {
        name: "Recommendation Engine",
        description: "Built a recommendation system that increased user engagement by 40%",
        tech: ["Python", "TensorFlow", "Pandas", "Scikit-learn"]
      },
      {
        name: "Fraud Detection System",
        description: "Developed an ML model to detect fraudulent transactions in real-time",
        tech: ["Python", "AWS", "SageMaker", "Docker"]
      }
    ],
    availability: "Available for data science projects and mentoring",
    timezone: "CST (UTC-6)",
    languages: ["English", "Spanish", "Portuguese"]
  }
};

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const userId = params.id as string;
  const user = userData[userId as keyof typeof userData];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User not found</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>Back to Explore</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  {/* Avatar and Basic Info */}
                  <div className="text-center mb-6">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className={`w-32 h-32 rounded-full object-cover border-4 ${user.borderColor} mx-auto mb-4 shadow-lg`} 
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 ${user.borderColor} bg-gray-300 shadow-lg mx-auto mb-4`}>
                        {user.initials}
                      </div>
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                    <div className="flex items-center justify-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2" />
                      {user.location}
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="flex items-center gap-2 text-yellow-500 font-semibold text-xl">
                        <FaStar className="text-xl" />
                        {user.rating}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                        {user.yearsExperience}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaUser className="mr-2" />
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
                    <p className="text-gray-700 mb-2">{user.availability}</p>
                    <p className="text-sm text-gray-600">Timezone: {user.timezone}</p>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.languages.map((language, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Request Button */}
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Send Connection Request</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Skills and Projects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills Offered */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Offered</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsOffered.map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Needed */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills Looking For</h2>
                  <div className="flex flex-wrap gap-3">
                    {user.skillsNeeded.map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Projects</h2>
                  <div className="space-y-6">
                    {user.projects.map((project, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 bg-white/50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIdx) => (
                            <span key={techIdx} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal 
          profile={user} 
          onClose={() => setShowRequestModal(false)} 
        />
      )}
    </div>
  );
} 