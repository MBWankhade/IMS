import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function FeedPreview() {
  const [activePost, setActivePost] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate(); 

  const handleJoinCommunity = () => {
    console.log('Navigate to signup');
    navigate("/signup");
  };

  // Simulate typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const posts = [
    { 
      id: 1, 
      user: "Rahul (CSE '23)", 
      avatar: "https://i.pravatar.cc/150?img=11",
      content: "Just cracked Google SWE! Ask me anything.", 
      likes: 42, 
      comments: 8,
      time: "2h ago",
      badge: "🔥 Hot",
      company: "Google",
      role: "SWE",
      package: "₹45 LPA",
      trending: true
    },
    { 
      id: 2, 
      user: "Priya (ECE '24)", 
      avatar: "https://i.pravatar.cc/150?img=12",
      content: "Microsoft internship interview experience - tips inside!", 
      likes: 35, 
      comments: 5,
      time: "4h ago",
      badge: "💡 Tips",
      company: "Microsoft",
      role: "Intern",
      package: "₹80k/month"
    },
    { 
      id: 3, 
      user: "Arjun (IT '23)", 
      avatar: "https://i.pravatar.cc/150?img=13",
      content: "Amazon final round tomorrow! Any last-minute tips for system design?", 
      likes: 28, 
      comments: 12,
      time: "6h ago",
      badge: "❓ Help",
      company: "Amazon",
      role: "SDE",
      package: "₹38 LPA",
      isQuestion: true
    }
  ];

  const onlineUsers = [
    { name: "Sneha", avatar: "https://i.pravatar.cc/150?img=14" },
    { name: "Vikram", avatar: "https://i.pravatar.cc/150?img=15" },
    { name: "Kavya", avatar: "https://i.pravatar.cc/150?img=16" },
    { name: "Rohan", avatar: "https://i.pravatar.cc/150?img=17" },
  ];

  return (
    <section className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Effects */}
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
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-300 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Community Activity
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Join the
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Community Buzz
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow VIT Pune students, share experiences, and get insider tips from successful candidates
          </p>

          {/* Online Users Counter */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {onlineUsers.map((user, idx) => (
                <img 
                  key={idx}
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-900 hover:scale-110 transition-transform cursor-pointer"
                />
              ))}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white">
                +99
              </div>
            </div>
            <span className="text-gray-400 font-medium">
              <span className="text-green-400 font-bold">247</span> students online now
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:border-gray-600/50 hover:scale-[1.01] hover:shadow-2xl"
                onMouseEnter={() => setActivePost(post.id)}
                onMouseLeave={() => setActivePost(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Trending badge */}
                {post.trending && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold text-white animate-pulse">
                    🔥 Trending
                  </div>
                )}

                {/* Outer glow for active post */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 ${activePost === post.id ? 'opacity-100' : ''}`}></div>
                
                <div className="relative">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={post.avatar} 
                          alt={post.user} 
                          className="w-12 h-12 rounded-full border-2 border-purple-500/50 group-hover:border-purple-400 transition-colors" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{post.user}</h3>
                        <p className="text-sm text-gray-400">{post.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300">
                        {post.badge}
                      </span>
                    </div>
                  </div>

                  {/* Company Info Card */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                          {post.company[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{post.company}</div>
                          <div className="text-xs text-gray-400">{post.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{post.package}</div>
                        <div className="text-xs text-gray-400">Package</div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {post.content}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group/like">
                        <svg className="w-5 h-5 group-hover/like:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group/comment">
                        <svg className="w-5 h-5 group-hover/comment:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-medium">{post.comments}</span>
                      </button>
                    </div>

                    {post.isQuestion && (
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm font-medium hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-teal-500/30 transition-all" onClick={() => navigate("/signup")}>
                        Help Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-6 transition-all duration-500 ${isTyping ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.pravatar.cc/150?img=18" 
                  alt="Someone typing" 
                  className="w-10 h-10 rounded-full border-2 border-gray-600" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 text-sm">Someone is typing</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join CTA */}
            <div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Join the Conversation</h3>
                <p className="text-gray-300 mb-6">Share your experience and help others succeed</p>
                <button 
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300"
                  onClick={handleJoinCommunity}
                >
                  Write for Community
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6">
              <h4 className="font-bold text-white mb-4">Community Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Today</span>
                  <span className="font-bold text-emerald-400">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Posts This Week</span>
                  <span className="font-bold text-blue-400">2,845</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Success Stories</span>
                  <span className="font-bold text-purple-400">341</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Questions Answered</span>
                  <span className="font-bold text-cyan-400">5,672</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6">
              <h4 className="font-bold text-white mb-4">🔥 Trending Topics</h4>
              <div className="space-y-2">
                {['Google Interview Tips', 'System Design Prep', 'Salary Negotiation', 'Mock Interview'].map((topic, idx) => (
                  <div key={idx} className="px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer">
                    #{topic.replace(' ', '').toLowerCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}