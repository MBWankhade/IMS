import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 


export default function Navbar() { 
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); 

  const navItems = [
    { name: 'How It Works', target: '#how-it-works' },
    { name: 'Features', target: '#features' },
    { name: 'Our Team', target: '#team' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target) => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleLogin = () => {
    console.log('Navigate to login');
    navigate("/login"); 
    setIsOpen(false);
  };

  const handleSignup = () => {
    console.log('Navigate to signup');
    navigate("/signup"); 
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-xl">VH</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VIT Horizon
              </span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">Interview Prep Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.target}
                className="relative px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-xl group"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.target);
                }}
              >
                <span className="relative z-10 font-medium">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-8 transition-all duration-300"></div>
              </a>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex gap-4">
            <button 
              className="group relative px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white transition-all duration-300 font-medium backdrop-blur-sm overflow-hidden"
              onClick={handleLogin}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">Login</span>
            </button>
            <button 
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 overflow-hidden"
              onClick={handleSignup}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                Sign Up
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              className="relative w-10 h-10 text-gray-300 hover:text-white focus:outline-none transition-colors duration-300 flex items-center justify-center rounded-lg hover:bg-gray-800/50"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-2.5' : 'top-1'
                }`}></span>
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 top-2.5 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-2.5' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-6 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={`mobile-${item.name}`}
                href={item.target}
                className="group block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 rounded-xl transition-all duration-300 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.target);
                }}
              >
                <div className="flex items-center justify-between">
                  {item.name}
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="flex gap-4 px-4 pt-4">
              <button 
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white hover:bg-blue-500/10 transition-all duration-300 font-medium backdrop-blur-sm"
                onClick={handleLogin}
              >
                Login
              </button>
              <button 
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                onClick={handleSignup}
              >
                Sign Up
              </button>
            </div>
            
            {/* Mobile Contact Info */}
            <div className="px-4 pt-4 border-t border-gray-800 mt-4">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Beta Access Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
             style={{ width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}>
        </div>
      )}
    </nav>
  );
}