import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import axios from "axios";
import { 
  FaSearch, 
  FaSpinner, 
  FaFilter, 
  FaClock, 
  FaEye, 
  FaUserCircle,
  FaTimes,
  FaFire,
  FaBookOpen,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaBuilding,
  FaStar,
  FaUsers
} from "react-icons/fa";
import { HiSparkles, HiTrendingUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataContext } from "../context/DataProvider";
import PostContent from "./PostContent";

const PostSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cachedResults, setCachedResults] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "relevance",
    timeRange: "all",
    company: ""
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { setRecommendedPosts } = useContext(DataContext);
  const searchInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const postsPerPage = 8;

  // Search suggestions data
  const searchSuggestionsData = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "SpaceX",
    "software engineer", "data scientist", "product manager", "frontend developer",
    "backend developer", "full stack", "DevOps", "machine learning"
  ];

  // Popular Companies Data
  const popularCompanies = [
    {
      id: 1,
      name: "NVIDIA",
      type: "Product Based",
      experiences: "12+",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Logo.png",
      gradient: "from-green-500 to-green-700",
      description: "AI & Graphics Technology Leader"
    },
    {
      id: 2,
      name: "Amazon",
      type: "Product & Service Based",
      experiences: "5+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
      gradient: "from-orange-500 to-yellow-600",
      description: "E-commerce & Cloud Computing Giant"
    },
    {
      id: 3,
      name: "Zensar",
      type: "Service Based",
      experiences: "8+",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCJUg62MuGIgotpuAUyv-V4E-0_TiaStUOSQ&s",
      gradient: "from-blue-500 to-purple-600",
      description: "Digital Solutions & Services"
    },
    {
      id: 4,
      name: "Oracle",
      type: "Product Based",
      experiences: "15+",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png",
      gradient: "from-red-500 to-red-700",
      description: "Enterprise Software Solutions"
    },
    {
      id: 5,
      name: "BlackRock",
      type: "Service Based",
      experiences: "6+",
      logo: "https://www.blackrock.com/blk-corp-assets/cache-1542297736000/images/media-bin/web/global/wordmark/blackrock-logo-nav.svg",
      gradient: "from-gray-700 to-black",
      description: "Investment Management"
    }
  ];

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setSearchResults([]);
        setResultsCount(0);
        setTotalPages(1);
      }
    }, 300);
  }, []);

  // Actual API call
  const performSearch = async (query, page = 1) => {
    const cacheKey = `${query}-${page}-${JSON.stringify(filters)}`;
    
    if (cachedResults[cacheKey]) {
      setSearchResults(cachedResults[cacheKey].posts);
      setResultsCount(cachedResults[cacheKey].totalPosts);
      setTotalPages(cachedResults[cacheKey].totalPages);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/search`,
        {
          params: {
            query: query,
            page: page,
            limit: postsPerPage,
            sortBy: filters.sortBy,
            timeRange: filters.timeRange,
            company: filters.company
          },
          withCredentials: true,
        }
      );

      setCachedResults(prev => ({
        ...prev,
        [cacheKey]: {
          posts: response.data.posts,
          totalPosts: response.data.totalPosts,
          totalPages: response.data.totalPages,
        }
      }));

      setSearchResults(response.data.posts);
      setResultsCount(response.data.totalPosts);
      setTotalPages(response.data.totalPages);
      
      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
      
    } catch (err) {
      toast.error("Failed to fetch posts.");
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    setCachedResults({});
    
    // Show suggestions
    if (value.length > 0) {
      const filtered = searchSuggestionsData.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const handleCompanyClick = (companyName) => {
    setSearchQuery(companyName);
    performSearch(companyName);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    performSearch(searchQuery, page);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (post) => {
    const recs = searchResults.filter((p) => p._id !== post._id).slice(0, 5);
    setRecommendedPosts(recs);
    setSelectedPost(post);
    navigate(`/search/${post._id}`);
  };

  const handleBackToSearch = () => {
    setSelectedPost(null);
    navigate("/search");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setResultsCount(0);
    setCurrentPage(1);
    setCachedResults({});
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowScrollTop(containerRef.current.scrollTop > 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trending searches data
  const trendingSearches = [
    "Google interview experience",
    "Microsoft placement",
    "Amazon coding round",
    "Meta behavioral questions",
    "Apple system design",
    "Netflix culture fit"
  ];

  if (selectedPost) {
    return (
      <SinglePost onBack={handleBackToSearch} />
    );
  }

  return (
    <div className="flex w-full h-full bg-black">
      {/* Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Discover Experiences
              </h1>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                <HiSparkles className="text-yellow-400" />
              </div>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore interview experiences, placement stories, and career insights from top companies
            </p>
          </div>

          {/* Search Section */}
          <div className="relative mb-10">
            <div className="relative max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for companies, roles, or interview experiences..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-14 py-5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          <FaTimes className="text-lg" />
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-5 rounded-xl border transition-all duration-300 ${
                        showFilters 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border-gray-700'
                      }`}
                    >
                      <FaFilter className="text-lg" />
                    </button>
                  </div>

                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl z-50">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-5 py-4 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <FaSearch className="inline mr-3 text-gray-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="max-w-5xl mx-auto mt-4 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 shadow-2xl animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => {
                        setFilters({...filters, sortBy: e.target.value});
                        setCurrentPage(1);
                        setCachedResults({});
                        performSearch(searchQuery, 1);
                      }}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Time Range</label>
                    <select
                      value={filters.timeRange}
                      onChange={(e) => {
                        setFilters({...filters, timeRange: e.target.value});
                        setCurrentPage(1);
                        setCachedResults({});
                        performSearch(searchQuery, 1);
                      }}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Company</label>
                    <input
                      type="text"
                      placeholder="Filter by company..."
                      value={filters.company}
                      onChange={(e) => {
                        setFilters({...filters, company: e.target.value});
                        setCurrentPage(1);
                        setCachedResults({});
                        performSearch(searchQuery, 1);
                      }}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          {!searchQuery.trim() ? (
            /* Empty State */
            <div className="space-y-10">
              {/* Popular Companies */}
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <FaBuilding className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Popular Companies</h2>
                      <p className="text-gray-400">Explore experiences from top companies</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaStar className="text-yellow-500" />
                    <span className="text-sm">Most Searched</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {popularCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanyClick(company.name)}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 border border-gray-700 hover:border-gray-600 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gray-700 rounded-lg items-center justify-center hidden">
                              <FaBuilding className="text-gray-400 text-2xl" />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                              {company.name}
                            </h3>
                            <p className="text-gray-400 text-sm font-medium mb-2">
                              {company.type}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              {company.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-full">
                            <FaUsers className="text-blue-400 text-sm" />
                            <span className="text-blue-400 text-sm font-medium">
                              {company.experiences} Experiences
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <FaFire className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Trending Searches</h2>
                    <p className="text-gray-400">What others are searching for</p>
                  </div>
                  <HiTrendingUp className="text-orange-400 text-2xl ml-auto" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        performSearch(search);
                      }}
                      className="group p-5 bg-gray-900/30 hover:bg-gray-800/50 border border-gray-800 hover:border-orange-500/50 rounded-xl transition-all duration-300 hover:scale-105 text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-500/20 group-hover:bg-orange-500/30 rounded-lg transition-colors">
                          <FaRocket className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-300 group-hover:text-white font-medium block">
                            {search}
                          </span>
                          <span className="text-gray-500 text-sm">Popular this week</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
                      <FaClock className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Recent Searches</h2>
                      <p className="text-gray-400">Your search history</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {searchHistory.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search);
                          performSearch(search);
                        }}
                        className="group px-5 py-3 bg-gray-900/30 hover:bg-gray-800/50 border border-gray-800 hover:border-purple-500/50 rounded-full transition-all duration-300 hover:scale-105"
                      >
                        <span className="text-gray-300 group-hover:text-white font-medium">
                          {search}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-8">
              {/* Results Count */}
              {resultsCount > 0 && !loading && (
                <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-300 text-lg">
                    Found <span className="text-white font-bold">{resultsCount.toLocaleString()}</span> results
                    {searchQuery && (
                      <span> for "<span className="text-blue-400 font-bold">{searchQuery}</span>"</span>
                    )}
                  </p>
                  <div className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-gray-700 rounded-full animate-spin"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-l-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-l-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  </div>
                  <p className="text-gray-300 font-medium text-xl">Searching for experiences...</p>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {!loading && searchResults.length > 0 && (
                <div className="grid gap-6">
                  {searchResults.map((post, index) => (
                    <div
                      key={post._id}
                      className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              {post.user?.profilePicture ? (
                                <img
                                  src={post.user.profilePicture}
                                  alt="Profile"
                                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                  <FaUserCircle className="text-white text-xl" />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <p className="font-semibold text-white">{post.user?.name}</p>
                              <p className="text-sm text-gray-400 flex items-center space-x-2">
                                <FaClock className="text-xs" />
                                <span>{formatTimeAgo(post.createdAt)}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-gray-500">
                            <div className="flex items-center space-x-1">
                              <FaEye className="text-sm" />
                              <span className="text-xs">{post.views}</span>
                            </div>
                            <div className="text-xs">
                              {formatDate(post.updatedAt)}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        
                        <div className="text-gray-300 mb-4 line-clamp-3">
                          <PostContent content={post.content} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-gray-400">
                              <span className="text-sm">👍</span>
                              <span className="text-sm">{post.likes || 0}</span>
                            </div>
                          </div>
                          
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && searchResults.length === 0 && searchQuery.trim() && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-4">No results found</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    We couldn't find any experiences matching your search. Try different keywords or browse trending searches.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && searchResults.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-12 h-12 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                              : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        toastClassName="bg-gray-800 text-white"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default PostSearch;