import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const navigate = useNavigate(); 

  const stats = [
    { 
      value: 500, 
      suffix: "+", 
      label: "Interview Experiences",
      icon: "💼",
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-500/10 to-cyan-500/10"
    },
    { 
      value: 200, 
      suffix: "+", 
      label: "Mock Sessions",
      icon: "🎯",
      color: "from-purple-400 to-pink-400",
      bgColor: "from-purple-500/10 to-pink-500/10"
    },
    { 
      value: 50, 
      suffix: "+", 
      label: "Companies Covered",
      icon: "🏢",
      color: "from-green-400 to-emerald-400",
      bgColor: "from-green-500/10 to-emerald-500/10"
    },
    { 
      value: 1000, 
      suffix: "+", 
      label: "Active Members",
      icon: "👥",
      color: "from-yellow-400 to-orange-400",
      bgColor: "from-yellow-500/10 to-orange-500/10"
    }
  ];

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate counters
  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        let startValue = 0;
        const increment = stat.value / 50; // 50 steps for smooth animation
        const timer = setInterval(() => {
          startValue += increment;
          if (startValue >= stat.value) {
            startValue = stat.value;
            clearInterval(timer);
          }
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = Math.floor(startValue);
            return newValues;
          });
        }, 30);
      });
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Statistics
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Platform
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Impact
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real numbers from our growing community of successful students
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.bgColor} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl hover:border-gray-600/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                
                {/* Value */}
                <div className="mb-3">
                  <span className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {isVisible ? animatedValues[index] : 0}
                  </span>
                  <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.suffix}
                  </span>
                </div>
                
                {/* Label */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                  {stat.label}
                </p>

                {/* Animated Border */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl transition-all duration-500 ${
                  isVisible ? 'w-full' : 'w-0'
                }`} style={{ transitionDelay: `${index * 200 + 500}ms` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl border border-gray-600/30 rounded-2xl">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                  i === 1 ? 'from-blue-400 to-purple-400' :
                  i === 2 ? 'from-purple-400 to-pink-400' :
                  i === 3 ? 'from-pink-400 to-red-400' :
                  i === 4 ? 'from-green-400 to-blue-400' :
                  'from-yellow-400 to-orange-400'
                } border-2 border-gray-800`}></div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Join 1000+ students</p>
              <p className="text-gray-400 text-sm">who cracked their dream jobs</p>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105" onClick={() => navigate("signup")}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}