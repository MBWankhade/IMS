import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddPostForm = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState(`
    <h2>Candidate Information:</h2> <br /> 
    <ul>
      <li>Status: [Briefly state if you are employed, seeking opportunities, etc.], [Total years of relevant experience], [Target position for this interview]</li>
      <li>Location: [City, State, Country]</li>
      <li>Interview Date: [Month Day, Year]</li>
    </ul>    <br />    
    <h2>Overview of Interview Process:</h2> <br />  
    <p><strong>Initial Screening</strong></p> <br />  
    <ul>
      <li>Duration: [e.g., 30 minutes]</li>
      <li>Method: [Phone/Video/In-person]</li>
      <li>Focus: [e.g., Background check, Skill assessment]</li>
      <li>Key Questions: [Summarize main questions asked]</li>
      <li>Obstacles: [Note any particular challenges faced during this stage]</li>
    </ul> <br />  
    <p><strong>Technical Round</strong></p> <br /> 
    <ul>
      <li>Duration: [e.g., 1 hour]</li>
      <li>Method: [Phone/Video/In-person]</li>
      <li>Focus: [e.g., Specific skills or projects relevant to the job]</li>
      <li>Key Questions: [Summarize technical or case study questions]</li>
      <li>Obstacles: [Any difficult moments or topics]</li>
    </ul> <br /> 
    <p>[Include additional rounds as necessary, such as Managerial Round, HR Round, etc.]</p> <br /> 
    <h2>Post-Interview Reflections:</h2> <br /> 
    <ul>
      <li>Company Culture Insights: [Describe the culture as perceived during the interview, interactions with team members if any]</li>
      <li>Work Environment: [Observations about the physical or virtual setting]</li>
      <li>Benefits Highlight: [Notable perks or benefits discussed]</li>
      <li>Evaluator Feedback: [General impressions from interactions with the interviewers]</li>
      <li>Suggestions for Improvement: [Constructive feedback on the interview process based on your experience]</li>
    </ul> <br />  
    <h2>Additional Information:</h2> <br /> 
    <ul>
      <li>[Any further details about the interview timeline, next steps, or miscellaneous notes]</li>
    </ul> <br /> 
    <h2>Closing Note:</h2> <br /> 
    <ul>
      <li>[A personal note or a general comment about the overall experience or expectations moving forward]</li>
    </ul>
  `);
  const [publishOnCommunity, setPublishOnCommunity] = useState(true);
  const [submitAsAnonymous, setSubmitAsAnonymous] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title: postTitle,
      content: postContent,
      publishOnCommunity,
      submitAsAnonymous,
    };
    try {
      // Uncomment this when you have the API endpoint ready
      // const response = await axios.post("/api/posts", postData);
      console.log("Post submitted successfully:", postData);
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    }
  };

  return (
    <div className="h-full w-full p-20 shadow-sm bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex gap-6">
        {/* First Div (2/3 width) */}
        <div className="w-3/4">
          {/* Post Title */}
          <div className="mb-6">
            <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700">
              Post Title
            </label>
            <div className="flex items-center">
              <input
                id="postTitle"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="For eg: ABC Company | Interview Experience | Role | Full Time"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Post Content (Rich Text Editor) */}
          <div className="mb-6">
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700">
              Post Content
            </label> 
            <ReactQuill 
              value={postContent}
              onChange={setPostContent}
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
              Words: {postContent.split(/\s+/).filter(Boolean).length} | Characters:{" "}
              {postContent.length}
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
              Submit for Review
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
              <label htmlFor="publishOnCommunity" className="ml-2 text-sm text-gray-700">
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
              <label htmlFor="submitAsAnonymous" className="ml-2 text-sm text-gray-700">
                Submit as Anonymous
              </label>
            </div>
          </div>

          {/* Illustration Card */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-md">
            <h3 className="text-lg font-bold mb-2">Write an Interview Experience</h3>
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
                <strong>Explore Contest</strong>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPostForm;