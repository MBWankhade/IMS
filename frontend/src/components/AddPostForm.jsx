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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <>
      <div className="h-full w-full p-6 shadow-sm bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md flex gap-6"
        >
          {/* First Div (2/3 width) */}
          <div className="w-3/4">
            {/* Post Title */}
            <div className="mb-6">
              {cardId === 1 ? (
                <div>
                  <CompanyRoleSelector
                    onCompanyChange={(selectedCompany) =>
                      setCompany(selectedCompany)
                    }
                    onRoleChange={(selectedRole) => setRole(selectedRole)}
                    onPlacementTypeChange={(selectedPlacementType) =>
                      setPlacementType(selectedPlacementType)
                    }
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="postTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Post Title
                  </label>
                  <div className="flex items-center">
                    <input
                      id="postTitle"
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Post Content (Rich Text Editor) */}
            <div className="mb-6">
              <label
                htmlFor="postContent"
                className="block text-sm font-medium text-gray-700"
              >
                Post Content
              </label>
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
                className="bg-white rounded-md shadow-sm custom-quill-editor"
              />
            </div>

            <div className="flex">
              {/* Word and Character Count */}
              <div className="mb-6 w-1/3">
                <div className="text-sm text-gray-600">
                  Words: {postContent.split(/\s+/).filter(Boolean).length} |
                  Characters: {postContent.length}
                </div>
              </div>

              {/* Extract Image Size Button */}
              <div className="mb-6 w-1/3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Extract Image Size
                </button>
              </div>

              <div className="w-1/3">
                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Save for Later
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Div (1/3 width) */}
          <div className="w-1/4">
            {/* Checkboxes */}
            <div className="mb-6 border border-blue-300 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="publishOnCommunity"
                  checked={publishOnCommunity}
                  onChange={(e) => setPublishOnCommunity(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="publishOnCommunity"
                  className="ml-2 text-sm text-gray-700"
                >
                  Publish on Community
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="submitAsAnonymous"
                  checked={submitAsAnonymous}
                  onChange={(e) => setSubmitAsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="submitAsAnonymous"
                  className="ml-2 text-sm text-gray-700"
                >
                  Submit as Anonymous
                </label>
              </div>
            </div>

            {/* Illustration Card */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-md">
              <h3 className="text-lg font-bold mb-2">
                Write an Interview Experience
              </h3>
              <img
                src="https://media.geeksforgeeks.org/contest/interviewExperiencescardcopy20240122114844.webp"
                alt="Write an Interview Experience"
                className="w-full rounded-md"
              />
              <div className="mt-4">
                <a
                  href="https://www.geeksforgeeks.org/write-interview-experience/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <strong>How to write an Interview Experience?</strong>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPostForm;
