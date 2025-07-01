import React, { useState } from 'react';

const Team = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  
  const team = [
    {
      id: 1,
      name: "Milind Wankhade",
      role: "Intern @Wolters Kluwer",
      avatar: "https://avatars.githubusercontent.com/u/99143992?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/milind-wankhade-1b162a224/",
        github: "http://github.com/MBWankhade"
      },
      bio: "Full-stack developer passionate about creating innovative solutions",
      skills: ["React", "Node.js", "Python"]
    },
    {
      id: 2,
      name: "Sushant Jadhav",
      role: "Intern @Johnson Controls",
      avatar: "https://avatars.githubusercontent.com/u/141134636?v=4",
      social: {
        linkedin: "https://linkedin.com/in/sushant-jadhav-abb244285",
        github: "https://github.com/sushantjadhav9112002"
      },
      bio: "Backend engineer focused on scalable systems and automation",
      skills: ["Java", "Spring", "AWS"]
    },
    {
      id: 3,
      name: "Omkar Aher",
      role: "Associate Engineer @Onix",
      avatar: "https://avatars.githubusercontent.com/u/149067091?v=4",
      social: {
        linkedin: "https://www.linkedin.com/in/omkar-aher/",
        github: "https://github.com/omk4567"
      },
      bio: "DevOps enthusiast building robust infrastructure solutions",
      skills: ["Docker", "Kubernetes", "CI/CD"]
    },
    {
      id: 4,
      name: "Neha Gupta",
      role: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      social: {
        linkedin: "#",
        github: "#"
      },
      bio: "Product strategist driving user-centric design and growth",
      skills: ["Strategy", "Analytics", "UX"]
    },
    {
      id: 5,
      name: "Vikram Joshi",
      role: "DevOps Engineer",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      social: {
        linkedin: "#",
        github: "#"
      },
      bio: "Cloud architect ensuring seamless deployment and monitoring",
      skills: ["Azure", "Terraform", "Monitoring"]
    }
  ];

  return (
    <section id="team" className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Effects - matching other components */}
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

      <div className="relative container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-300 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Meet Our Team
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Behind
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              VIT Horizon
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The passionate team building this platform to connect and empower VITians across their career journey
          </p>
        </div>

        {/* Team Grid - Single Row for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6">
          {team.map((member, index) => (
            <div 
              key={member.id}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Card with glassmorphism - Larger size */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 text-center
                            hover:border-gray-600/50 hover:scale-105 
                            transition-all duration-500 
                            hover:shadow-2xl hover:shadow-purple-500/10
                            cursor-pointer min-h-[400px] flex flex-col">

                {/* Outer glow for hover */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 ${hoveredMember === member.id ? 'opacity-100' : ''}`}></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Avatar - Larger */}
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full rounded-2xl object-cover border-2 border-gray-600/50 group-hover:border-purple-400/50 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                      {member.role}
                    </p>
                    
                    {/* Bio - shows on hover */}
                    <p className={`text-sm text-gray-400 leading-relaxed mb-5 transition-all duration-300 ${hoveredMember === member.id ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'} overflow-hidden`}>
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className={`flex flex-wrap gap-2 justify-center mb-6 transition-all duration-300 ${hoveredMember === member.id ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'} overflow-hidden`}>
                      {member.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 mt-auto">
                    <a 
                      href={member.social.linkedin} 
                      className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group/social"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5 group-hover/social:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a 
                      href={member.social.github} 
                      className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group/social"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5 group-hover/social:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;