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
import { FileText, Send, Users, UserX, X, AlertTriangle, CheckCircle, ArrowRight, Star, MessageCircle, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

// Quality Feedback Modal Component
const QualityFeedbackModal = ({ isOpen, onClose, feedbackData, onKeepFeedbackVisible }) => {
  if (!isOpen || !feedbackData) return null;

  const { message, aiFeedback } = feedbackData;
  const { score, issues, suggestions } = aiFeedback;

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBarColor = (score) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleKeepVisible = () => {
    onKeepFeedbackVisible();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Post Quality Review</h2>
              <p className="text-gray-400 text-sm">Your post needs improvement before publishing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-semibold">Quality Score</span>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}/10
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(score)}`}
                style={{ width: `${(score / 10) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-gray-400 text-sm">
              {score < 4 ? 'Needs significant improvement' : 
               score < 7 ? 'Good start, but could be better' : 
               'Great quality!'}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Feedback</h3>
                <p className="text-gray-300">{message}</p>
              </div>
            </div>
          </div>

          {issues && issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Issues Found ({issues.length})
              </h3>
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <div key={index} className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Suggestions for Improvement ({suggestions.length})
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">💡 Quick Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Be specific and detailed in your experiences</li>
              <li>• Include actual questions and scenarios you encountered</li>
              <li>• Replace template placeholders with real information</li>
              <li>• Add actionable tips that others can use</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleKeepVisible}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Keep Feedback Visible
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Persistent Quality Feedback Panel Component
const QualityFeedbackPanel = ({ feedbackData, onClose, isCollapsed, onToggleCollapse }) => {
  if (!feedbackData) return null;

  const { message, aiFeedback } = feedbackData;
  const { score, issues, suggestions } = aiFeedback;

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBarColor = (score) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-xl border border-orange-500/20 overflow-hidden">
      {/* Header - Always Visible */}
      <div className="p-4 border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Quality Feedback</h3>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${getScoreColor(score)}`}>
                  Score: {score}/10
                </span>
                <div className="w-16 bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${getScoreBarColor(score)}`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              title={isCollapsed ? "Expand feedback" : "Collapse feedback"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              title="Hide feedback"
            >
              <EyeOff className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        {isCollapsed && (
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">{message}</p>
        )}
      </div>

      {/* Expandable Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-semibold mb-1 text-sm">Feedback</h4>
                <p className="text-gray-300 text-sm">{message}</p>
              </div>
            </div>
          </div>

          {issues && issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Issues ({issues.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {issues.map((issue, index) => (
                  <div key={index} className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-gray-300 text-xs">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Suggestions ({suggestions.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 text-xs">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

  // Quality feedback modal states
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [qualityFeedback, setQualityFeedback] = useState(null);
  
  // Persistent feedback panel states
  const [showPersistentFeedback, setShowPersistentFeedback] = useState(false);
  const [isPersistentFeedbackCollapsed, setIsPersistentFeedbackCollapsed] = useState(false);

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
      
      // Clear feedback on successful submission
      setQualityFeedback(null);
      setShowPersistentFeedback(false);
      
    } catch (err) {
      // Check if the error response contains quality feedback
      if (err.response && err.response.data && err.response.data.aiFeedback) {
        // Show quality feedback modal
        setQualityFeedback(err.response.data);
        setShowQualityModal(true);
        // Hide persistent feedback when modal is shown
        setShowPersistentFeedback(false);
      } else {
        // Show generic error for other types of errors
        if (err && err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Failed to create post.");
        }
      }
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

  const handleKeepFeedbackVisible = () => {
    setShowPersistentFeedback(true);
    setIsPersistentFeedbackCollapsed(false);
  };

  const handleClosePersistentFeedback = () => {
    setShowPersistentFeedback(false);
    setQualityFeedback(null);
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
            {/* Persistent Quality Feedback Panel */}
            {showPersistentFeedback && qualityFeedback && (
              <QualityFeedbackPanel
                feedbackData={qualityFeedback}
                onClose={handleClosePersistentFeedback}
                isCollapsed={isPersistentFeedbackCollapsed}
                onToggleCollapse={() => setIsPersistentFeedbackCollapsed(!isPersistentFeedbackCollapsed)}
              />
            )}

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
            {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
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
            </div> */}

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

      {/* Quality Feedback Modal */}
      <QualityFeedbackModal
        isOpen={showQualityModal}
        onClose={() => setShowQualityModal(false)}
        feedbackData={qualityFeedback}
        onKeepFeedbackVisible={handleKeepFeedbackVisible}
      />
    </div>
  );
};

export default AddPostForm;