import React, { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getContent } from "../utils/utils";
import CompanyRoleSelector from "./CompanyRoleSelector";
import Navbar from "./Navbar";
import { DataContext } from "../context/DataProvider";
import { FileText, Send, Users, UserX } from "lucide-react";

const AddPostForm = () => {
  const { user } = useContext(DataContext);
  const location = useLocation();
  const cardId = location.state?.id;

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [placementType, setPlacementType] = useState("");

  const initialPostContent = getContent(cardId);

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState(initialPostContent);
  const quillRef = useRef(null);

  const [publishOnCommunity, setPublishOnCommunity] = useState(true);
  const [submitAsAnonymous, setSubmitAsAnonymous] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine postType based on cardId
      const postType = cardId; // cardId corresponds to postType in the model

      // Prepare the data to be sent to the backend
      const postData = {
        postType,
        content: postContent,
      };

      // If postType is 1 (Interview Experience), include company, role, and placementType
      if (postType === 1) {
        console.log(postData)
        postData.company = company;
        postData.role = role;
        postData.placementType = placementType;
        postData.title = `${postData.company} | Interview Experience | ${postData.role} | ${postData.placementType}`;
      } else {
        // For other post types, include the manually entered title
        postData.title = postTitle;
      }

      // Send the data to the backend
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts`,
        postData,
        { withCredentials: true }
      );

      toast.success("Post created successfully!");
    } catch (err) {
      toast.error("Failed to create post.");
      console.error("Error creating post", err);
    } finally {
      setIsSubmitting(false);
      setPostContent(initialPostContent);
      setPostTitle("");
      setCompany("");
      setRole("");
      setPlacementType("");
    }
  };

  const handleChange = (value) => {
    setPostContent(value);

    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const images = quill.container.querySelectorAll("img");

      images.forEach((image) => {
        image.style.width = "150px";
        image.style.height = "auto";
      });
    }
  };

  const wordCount = postContent.split(/\s+/).filter(Boolean).length;
  const charCount = postContent.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {cardId === 1 ? 'Share Your Interview Experience' : 'Create New Post'}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {cardId === 1 
              ? 'Help others by sharing your interview journey and insights'
              : 'Share your thoughts and experiences with the community'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title/Company Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              {cardId === 1 ? (
                <div>
                  <CompanyRoleSelector
                    company={company}
                    role={role}
                    placementType={placementType}
                    onCompanyChange={(selectedCompany) => setCompany(selectedCompany)}
                    onRoleChange={(selectedRole) => setRole(selectedRole)}
                    onPlacementTypeChange={(selectedPlacementType) => setPlacementType(selectedPlacementType)}
                  />

                </div>
              ) : (
                <div>
                  <label
                    htmlFor="postTitle"
                    className="block text-lg font-semibold text-white mb-3 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Post Title
                  </label>
                  <input
                    id="postTitle"
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter an engaging title for your post..."
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <label
                htmlFor="postContent"
                className="block text-lg font-semibold text-white mb-4 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Post Content
              </label>
              <div className="mt-1 overflow-scroll custom-scrollbar h-[400px]">
                <ReactQuill
                  ref={quillRef}
                  value={postContent}
                  onChange={handleChange}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["blockquote", "code-block"],
                      ["clean"],
                    ],
                  }}
                  className="bg-white text-black rounded-md shadow-sm custom-quill-editor h-[400px]"
                />
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Words: {wordCount}
                  </span>
                  <span>Characters: {charCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${wordCount >= 100 ? 'bg-green-500' : wordCount >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-400">
                    {wordCount >= 100 ? 'Good length' : wordCount >= 50 ? 'Consider adding more detail' : 'Too short'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publishing Options */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Publishing Options
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={publishOnCommunity}
                      onChange={(e) => setPublishOnCommunity(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      publishOnCommunity 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {publishOnCommunity && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Publish on Community</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={submitAsAnonymous}
                      onChange={(e) => setSubmitAsAnonymous(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      submitAsAnonymous 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {submitAsAnonymous && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Submit as Anonymous</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Guidelines for Interview Experience */}
            {cardId === 1 && (
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">
                  📝 Interview Experience Guidelines
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include your preparation strategy and timeline</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Describe the interview process and rounds</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Share specific questions you were asked</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Mention key tips and learnings</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuidelines(!showGuidelines)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  {showGuidelines ? 'Hide' : 'Read'} full guidelines →
                </button>
              </div>
            )}

            {/* User Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">
                👤 Publishing as
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {submitAsAnonymous ? '?' : user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {submitAsAnonymous ? 'Anonymous User' : user?.name || 'User'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {submitAsAnonymous ? 'Your identity will be hidden' : user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;