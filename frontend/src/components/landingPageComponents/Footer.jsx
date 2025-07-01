import React, { useState } from 'react';

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" }
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "Blog", href: "#blog" },
        { name: "Help Center", href: "#help" },
        { name: "Tutorials", href: "#tutorials" }
      ]
    },
    {
      title: "Company",
      items: [
        { name: "About", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      ),
      color: 'hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30'
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      ),
      color: 'hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30'
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      ),
      color: 'hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30'
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
      color: 'hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30'
    }
  ];

  return (
    <footer className="relative bg-gray-950 overflow-hidden">
      {/* Background Effects - matching Team component */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/2 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-purple-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-blue-400/25 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-cyan-400/20 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

      <div className="relative container mx-auto px-6 lg:px-8 pt-20 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="group">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                    <span className="text-white font-black text-xl">VH</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  VIT Horizon
                </span>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Empowering VIT Pune students to excel in campus placements and build successful careers.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-400 transition-all duration-300 group/social ${social.color}`}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    aria-label={social.name}
                  >
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${hoveredSocial === index ? 'scale-110' : ''}`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {links.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-white font-bold text-lg tracking-wide mb-6 relative">
                {section.title}
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const linkKey = `${sectionIndex}-${itemIndex}`;
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-all duration-300 group flex items-center gap-2 text-base"
                        onMouseEnter={() => setHoveredLink(linkKey)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <span className={`transition-transform duration-300 ${hoveredLink === linkKey ? 'translate-x-1' : ''}`}>
                          {item.name}
                        </span>
                        <svg 
                          className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${hoveredLink === linkKey ? 'translate-x-1' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 mb-12">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-white mb-3">Stay Updated</h4>
            <p className="text-gray-300 mb-6">Get the latest placement updates and career tips delivered to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-gray-800/70 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-base mb-2">
                © {new Date().getFullYear()} VIT Horizon. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Made with ❤️ for VIT Pune students
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((policy) => (
                <a
                  key={policy}
                  href="#"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {policy}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;