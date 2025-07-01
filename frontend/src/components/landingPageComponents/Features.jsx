import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate(); 

  const handleSignup = () => {
    console.log('Navigate to signup');
    navigate("/signup"); 
  };

  const features = [
    {
      id: 1,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Interview Experiences",
      description: "Real interview questions and answers from top companies visiting VIT Pune campus.",
      gradient: "from-purple-500 to-blue-600",
      glowColor: "purple-500/20",
      benefits: ["500+ Real Questions", "Company-wise Filter", "Latest Updates"]
    },
    {
      id: 2,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mock Interviews",
      description: "Practice with seniors through live video sessions with code editor and feedback.",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "blue-500/20",
      benefits: ["Live Video Sessions", "Real-time Feedback", "Code Editor"]
    },
    {
      id: 3,
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Smart Search",
      description: "Filter interviews by company, role, package, or placement type (FT/Intern).",
      gradient: "from-cyan-500 to-green-500",
      glowColor: "cyan-500/20",
      benefits: ["Advanced Filters", "Quick Results", "Smart Suggestions"]
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-300 mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powerful Features
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ace Your Placements
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive features designed specifically for VIT Pune students to excel in campus recruitment
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Outer glow effect */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700`}></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 lg:p-10 transition-all duration-500 group-hover:border-gray-600/50 group-hover:scale-[1.02] group-hover:shadow-2xl">
                
                {/* Icon container with enhanced design */}
                <div className="relative mb-8">
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Floating dot indicator */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                  </div>

                  {/* Benefits list - shows on hover */}
                  <div className={`space-y-2 transition-all duration-500 ${hoveredFeature === feature.id ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Enhanced CTA */}
                  <div className="pt-4">
                    <button 
                      className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 rounded-xl font-semibold text-sm text-gray-300 hover:text-white hover:border-gray-500/50 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 backdrop-blur-sm"
                      onClick={handleSignup}
                    >
                      <span>Get Started</span>
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-gray-900"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-gray-900"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full border-2 border-gray-900"></div>
            </div>
            <span className="text-gray-300 font-medium">Join 5,000+ students already using these features</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;