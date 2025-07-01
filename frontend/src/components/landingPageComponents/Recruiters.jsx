import React from 'react';

export default function Recruiters() {
  const companies = ["Nvidia", "Amazon", "BlackRock", "Zensar", "Oracle"];
  
  return (
    <section className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Effects - matching FeedPreview style */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-ping delay-1000"></div>
      </div>
      
      <div className="relative container mx-auto px-6 lg:px-8 max-w-6xl">
        {/* Enhanced Header - matching FeedPreview style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-300 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Our Trusted Partners
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Top Recruiters at
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              VIT Pune
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Leading companies that trust VIT graduates to drive innovation and excellence across industries
          </p>
        </div>
        
        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {companies.map((company, index) => (
            <div 
              key={index} 
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card - matching FeedPreview glassmorphism style */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 
                            hover:border-gray-600/50 hover:scale-105 
                            transition-all duration-500 
                            hover:shadow-2xl hover:shadow-purple-500/10
                            cursor-pointer">
                
                {/* Outer glow for hover */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                
                {/* Company name */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black text-transparent bg-clip-text 
                               bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100
                               group-hover:from-white group-hover:to-gray-200
                               transition-all duration-500">
                    {company}
                  </h3>
                </div>
                
                {/* Company initial icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-bold text-purple-300">{company[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom section - matching FeedPreview stats style */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
            <div className="text-center">
              <h4 className="font-bold text-white mb-6 text-lg">Placement Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="font-black text-2xl text-emerald-400 mb-1">95%</div>
                  <div className="text-xs text-gray-400">Placement Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-2xl text-blue-400 mb-1">₹12L</div>
                  <div className="text-xs text-gray-400">Avg Package</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-2xl text-purple-400 mb-1">₹50L</div>
                  <div className="text-xs text-gray-400">Highest Package</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-2xl text-cyan-400 mb-1">500+</div>
                  <div className="text-xs text-gray-400">Companies</div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-600"></div>
                <span>Trusted by industry leaders</span>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}