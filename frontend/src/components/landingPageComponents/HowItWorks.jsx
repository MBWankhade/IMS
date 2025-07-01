import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate(); 

  const steps = [
    {
      icon: '📝',
      title: 'Share Experiences',
      desc: 'Post your interview stories, questions, and insights to help peers learn from real experiences.',
      details: ['Share interview questions', 'Document company culture', 'Help others prepare better'],
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      number: '01'
    },
    {
      icon: '🎥',
      title: 'Mock Interviews',
      desc: 'Practice with peers through live video sessions and get real-time feedback on your performance.',
      details: ['1-on-1 mock sessions', 'Real-time feedback', 'Record for later review'],
      color: 'from-purple-400 to-pink-400',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      number: '02'
    },
    {
      icon: '🚀',
      title: 'Get Hired',
      desc: 'Apply your learnings and confidence gained to crack actual interviews at your dream companies.',
      details: ['Improved confidence', 'Better preparation', 'Higher success rate'],
      color: 'from-green-400 to-emerald-400',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      number: '03'
    }
  ];

  // Auto-rotate active step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Connecting Lines */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl hidden lg:block">
        <svg className="w-full h-32" viewBox="0 0 800 120" fill="none">
          <path 
            d="M100 60 Q400 20 700 60" 
            stroke="url(#gradient)" 
            strokeWidth="2" 
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            Simple Process
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your interview preparation and land your dream job
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`group relative cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${step.bgColor} rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 z-20">
                <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center font-black text-white shadow-xl`}>
                  {step.number}
                </div>
              </div>

              {/* Card */}
              <div className={`relative bg-gray-800/50 backdrop-blur-xl border-2 ${
                activeStep === index ? step.borderColor : 'border-gray-700/50'
              } p-8 rounded-3xl transition-all duration-500 group-hover:border-opacity-100 ${
                activeStep === index ? 'transform scale-105 shadow-2xl' : 'group-hover:transform group-hover:scale-105'
              }`}>
                
                {/* Icon with Animation */}
                <div className="relative mb-6">
                  <div className={`text-6xl transform transition-all duration-500 ${
                    activeStep === index ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-6'
                  }`}>
                    {step.icon}
                  </div>
                  {activeStep === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                  )}
                </div>
                
                {/* Content */}
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                  {step.title}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6 leading-relaxed">
                  {step.desc}
                </p>

                {/* Details List */}
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                      <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}></div>
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-gray-700 rounded-b-3xl overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500 ${
                      activeStep === index ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-4 mb-12">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl border border-gray-600/30 rounded-3xl">
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-bold text-white mb-2">Ready to get started?</h4>
              <p className="text-gray-400">Join thousands of students who've successfully landed their dream jobs</p>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2" onClick={() => navigate("/signup")}>
              Start Your Journey
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}