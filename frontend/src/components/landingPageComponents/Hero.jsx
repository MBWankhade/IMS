import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Interviews', 'Coding Tests', 'Technical Rounds', 'HR Rounds'];
  const navigate = useNavigate(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = () => {
    console.log('Navigate to signup');
    navigate("/signup"); 
  };

  const handleDemo = () => {
    console.log('Watch demo');
    // Replace with your demo logic
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
        
        {/* Floating orbs with improved animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/6 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left Content - Enhanced Typography and Layout */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full text-sm font-medium text-emerald-300 backdrop-blur-md">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              🚀 Now Live - Free Access
            </div>

            {/* Dynamic Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tight">
                <span className="block text-white mb-2">
                  Ace Your
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {words[currentWord]}
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-gray-300 mt-6">
                at <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">VIT Pune</span>
              </p>
            </div>

            {/* Enhanced Subtitle */}
            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
              <p className="text-xl text-gray-300 leading-relaxed">
                Master technical interviews with AI-powered practice, peer collaboration, and real-time feedback.
              </p>
              <p className="text-lg text-blue-300 font-medium">
                Join 5,000+ students who landed their dream jobs
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleSignup}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span>Start Free Trial</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>

              <button 
                className="group px-8 py-4 border border-gray-600 rounded-xl font-semibold text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm"
                onClick={handleDemo}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Watch Demo</span>
                </div>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">5K+</div>
                <div className="text-gray-400 text-sm mt-1">Placements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">200+</div>
                <div className="text-gray-400 text-sm mt-1">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">95%</div>
                <div className="text-gray-400 text-sm mt-1">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Custom Interview Visualization */}
          <div className="relative">
            <div className="relative group">
              {/* Outer glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Main container */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-500">
                
                {/* Interview Dashboard Mockup */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-400">Interview Prep Dashboard</div>
                  </div>

                  {/* Mock Interview Cards */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-medium">Technical Round</div>
                          <div className="text-blue-300 text-sm">Data Structures & Algorithms</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-medium">Coding Challenge</div>
                          <div className="text-purple-300 text-sm">Live Coding Session</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-3/5"></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-medium">HR Round</div>
                          <div className="text-emerald-300 text-sm">Behavioral Questions</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">92%</div>
                      <div className="text-yellow-300 text-sm">Interview Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Floating Success Badges */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center animate-bounce shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse shadow-2xl">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center hover:border-gray-500 transition-colors cursor-pointer">
          <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}