import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyRoleSelector from "./CompanyRoleSelector";
import SinglePost from "./SinglePost";
import { FaSearch, FaSpinner } from "react-icons/fa";
import axios from "axios";
import PostContent from "./PostContent";
import { useNavigate } from "react-router-dom";

const PostSearch = () => {
  const [searchFilters, setSearchFilters] = useState({
    company: "",
    role: "",
    placementType: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // ✅ Ensure this updates correctly
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [cachedResults, setCachedResults] = useState({}); // ✅ Store cached results
  const navigate = useNavigate();
  const postsPerPage = 5;

  // Handle filter changes & reset cache
  const handleFilterChange = (selectedCompany, selectedRole, selectedPlacementType) => {
    setSearchFilters({
      company: selectedCompany,
      role: selectedRole,
      placementType: selectedPlacementType,
    });
    setSearchTriggered(false);
    setCachedResults({}); // ✅ Clear cache when filters change
    setTotalPages(1); // ✅ Reset totalPages
  };

  // Trigger search and reset pagination
  const handleSearchClick = () => {
    setCurrentPage(1);
    setSearchTriggered(true);
    setCachedResults({});
    setTotalPages(1); // ✅ Reset totalPages when new search starts
  };

  // Fetch posts from backend (checks cache first)
  const fetchPosts = async () => {
    if (!searchTriggered) return; // ✅ Avoid API calls until search is clicked

    // ✅ If page is cached, use it & update totalPages
    if (cachedResults[currentPage]) {
      setSearchResults(cachedResults[currentPage].posts);
      setTotalPages(cachedResults[currentPage].totalPages); // ✅ Fix missing page numbers
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search`, {
        params: {
          company: searchFilters.company,
          role: searchFilters.role,
          placementType: searchFilters.placementType,
          page: currentPage,
          limit: postsPerPage,
        },
        withCredentials: true,
      });

      // ✅ Store API response in cache
      setCachedResults((prev) => ({
        ...prev,
        [currentPage]: { posts: response.data.posts, totalPages: response.data.totalPages },
      }));

      setSearchResults(response.data.posts);
      setResultsCount(response.data.totalPosts);
      setTotalPages(response.data.totalPages); // ✅ Fix missing page numbers

      if (searchTriggered && currentPage === 1) {
        toast.info(`Found ${response.data.totalPosts} results.`);
      }
    } catch (err) {
      toast.error("Failed to fetch posts.");
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when searchTriggered changes OR when switching pages
  useEffect(() => {
    fetchPosts();
  }, [searchTriggered, currentPage]); // ✅ Now properly fetches & updates totalPages

  // Handle post click
  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/search/${post._id}`);
  };

  // Handle back to search
  const handleBackToSearch = () => {
    setSelectedPost(null);
    navigate("/search");
  }; 

  const recommendedPosts = searchResults
    .filter((post) => post._id !== selectedPost?._id) // Exclude selected post
    .slice(0, 5);

  return (
    <div className="flex w-full p-20 shadow-sm bg-gray-50 h-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto w-full">
        {selectedPost ? (
          <SinglePost onBack={handleBackToSearch} recommendedPosts={recommendedPosts}/>
        ) : (
          <>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Search Interview Experiences</h2>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-3xl">
                  <CompanyRoleSelector
                    onCompanyChange={(selectedCompany) =>
                      handleFilterChange(selectedCompany, searchFilters.role, searchFilters.placementType)
                    }
                    onRoleChange={(selectedRole) =>
                      handleFilterChange(searchFilters.company, selectedRole, searchFilters.placementType)
                    }
                    onPlacementTypeChange={(selectedPlacementType) =>
                      handleFilterChange(searchFilters.company, searchFilters.role, selectedPlacementType)
                    }
                  />
                </div>

                {/* Search Button */}
                <div className="mt-5">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    onClick={handleSearchClick}
                    disabled={loading}
                  >
                    {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <><FaSearch className="w-5 h-5" /><span>Search</span></>}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            {resultsCount > 0 && <div className="text-sm text-gray-600 mb-4">Found {resultsCount} results.</div>}

            {/* Posts List Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {searchResults.map((post) => (
                      <div key={post._id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePostClick(post)}>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                        <PostContent content={post.content} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination (✅ Now shows page numbers correctly) */}
                  <div className="flex justify-center mt-8">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-4 py-2 rounded-md ${
                          currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600 py-8">No posts found matching your criteria.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostSearch;
