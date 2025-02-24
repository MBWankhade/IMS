import React, { useContext, useEffect } from "react";
import { DataContext } from "../context/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaThumbsUp, FaComment, FaShare, FaRetweet } from "react-icons/fa";
import { Icon } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Dummy data for posts
  const posts = [
    {
      id: 1,
      name: "Vivek Jadhav",
      title: "BNY Mellon Interview Experience for SDE 2023",
      content: `Last Updated: 07 Jul, 2023
  
  Round 1: Online Assessment (HackerEarth)
  - Conducted on March 4th, 2023
  - 2 hours 30 minutes, 3 coding problems (Easy to Hard)
  - Topics: 
    1. Graph: Medium (Solved)
    2. Graph: Hard (Partially solved)
    3. Arrays + Greedy: Easy (Solved)
  - Cleared the round & moved to Round 2
  
  Round 2: Online Assessment (HackerEarth)
  - Conducted on March 10th, 2023
  - 10 MCQs (CS Fundamentals, OS, DBMS)
  - 1 SQL Question (Medium)
  - 1 Coding Problem (Graph + DP + XOR) [Hard]
  - Attempted in Python but was unsuccessful in coding problem
  - Cleared the round & moved to interviews
  
  Round 3: Technical Interview 1
  - Conducted on April 14th, 2023 (HackerRank CodePair)
  - Discussed past internships & projects
  - Asked 2 DSA questions:
    1. Smallest subarray with K distinct numbers (Partially solved)
    2. Job Scheduling (Greedy + Heap) [Solved]
  - CS Fundamentals: Inner Join vs Outer Join, Normalization, Arrays vs Linked List
  - Cleared the round & moved to Round 4
  
  Round 4: Technical Interview 2
  - Conducted on May 4th, 2023 (HackerRank CodePair)
  - Given a DSA problem: Find largest subgrid in a square grid (Conditions applied)
  - Solved using Binary Search + Cumulative Sums + Greedy Algorithms
  - Cleared the round & moved to Final Round
  
  Round 5: Technical + Managerial
  - Conducted on June 2nd, 2023
  - Discussion on Trading & Mutual Funds
  - Asked for modifications in past projects
  - Asked about work culture & company experience
  
  VERDICT: Selected ✅
  - Received confirmation within a week
  
  KEY TAKEAWAYS:
  - Aim for 60-70% score in online assessments
  - Strong DSA knowledge is crucial for interviews
  - Be patient; the process took 3-4 months
    
  Good luck to everyone preparing! 🚀`,
      likes: 30,
      comments: 12,
      reposts: 5,
    },
  
    {
      id: 2,
      name: "Milind Wankhede",
      title: "Amazon Interview Experience for SDE 2024",
      content: `Last Updated: 15 Dec, 2023
  
  Round 1: Online Assessment
  - Conducted on HackerRank
  - 3 Coding Questions (Medium-Hard)
  - Topics:
    1. Sliding Window + HashMap
    2. Dynamic Programming (Subset Sum)
    3. Graph Traversal (BFS + DFS)
  - Cleared the round and moved to interviews
  
  Round 2: Technical Interview 1
  - Conducted on December 20th, 2023 (Amazon Chime)
  - Discussion on past projects (Scalability & Optimization)
  - Coding problems:
    1. Merge K Sorted Lists (Heap)
    2. LRU Cache Implementation
  - System Design: Design a URL Shortener
  - CS Fundamentals: Deadlocks, Multi-threading, Indexing in DBMS
  - Cleared the round & moved to Round 3
  
  Round 3: Technical Interview 2
  - Conducted on December 25th, 2023
  - Asked to optimize previous solutions
  - One DSA question: Find the median of a stream of integers (Heap + Binary Search)
  - DBMS questions: ACID Properties, Transaction Handling
  - Cleared the round & moved to Final Round
  
  Round 4: HR Interview
  - Conducted on January 2nd, 2024
  - Discussion on Leadership Principles
  - Situational questions on teamwork & conflict resolution
  
  VERDICT: Selected ✅
  - Offer letter received within a week
  
  KEY TAKEAWAYS:
  - Focus on Amazon Leadership Principles for the HR round
  - Expect heap, DP, and system design questions
  - Optimize solutions live during interviews`,
      likes: 45,
      comments: 20,
      reposts: 10,
    },
  
    {
      id: 3,
      name: "Sushant Jadhav",
      title: "Google Interview Experience for SDE 2024",
      content: `Last Updated: 10 Jan, 2024
  
  Round 1: Online Assessment
  - Conducted on Google Hiring Platform
  - 2 Coding Problems (Medium-Hard)
  - Topics:
    1. Trie Data Structure
    2. Dynamic Programming + Bit Manipulation
  - Cleared the round & moved to interviews
  
  Round 2: Technical Interview 1
  - Conducted on January 15th, 2024 (Google Meet)
  - Deep discussion on past projects (Scalability & Performance)
  - Coding problems:
    1. Implement AutoComplete using Trie
    2. Find Bridges in a Graph (Tarjan's Algorithm)
  - CS Fundamentals: Paging vs Segmentation, Process vs Thread
  - Cleared the round & moved to Round 3
  
  Round 3: Technical Interview 2
  - Conducted on January 20th, 2024
  - System Design: Design Google Drive
  - Optimized past solutions in O(log N)
  - Database Indexing, Caching Strategies
  - Cleared the round & moved to Final Round
  
  Round 4: Hiring Manager Round
  - Conducted on January 30th, 2024
  - Discussion on Google's culture & problem-solving mindset
  - Behavioral questions on handling pressure and tight deadlines
  - Asked for project enhancements
  
  VERDICT: Selected ✅
  - Offer received in 10 days
  
  KEY TAKEAWAYS:
  - Master Trie, DP, Graphs, and System Design
  - Optimize solutions live and explain approach clearly
  - Be prepared for deep project discussions`,
      likes: 60,
      comments: 25,
      reposts: 15,
    },
  ];
   

  useEffect(() => {
    if (localStorage.getItem("googleLoginSuccess")) {
      toast.success(`Google Login successful! Welcome back ${user?.name}.`);
      localStorage.removeItem("googleLoginSuccess");
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success(`Login successful! Welcome back ${user?.name}`);
    } else if (location.state?.signupSuccess) {
      toast.success(`Signup successful! Welcome aboard ${user?.name}`);
    }
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.state]);

  return (
    <> 
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover />
      <div className="flex h-full w-full p-20 shadow-sm bg-gray-50">
        {/* Profile Card (Left) */}
        <div className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg" style={{ height: "250px", overflowY: "auto" }}>
          <div className="flex flex-col items-center">
            <FaUserCircle size={80} className="mb-4 cursor-pointer" />
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.title || "Your Title"}</p>
            <button className="mt-4 p-2 w-full bg-blue-500 text-white rounded-lg">
              View Profile
            </button>
          </div>
        </div> 

        {/* Main Feed (Middle) */} 
        <div className="flex-1"> 
          {/* Write for Community Div */} 
          <div className="m-5 p-5 bg-white border border-blue-300 rounded-lg">
            <div className="flex items-center">
              <FaUserCircle size={55} className="mr-4 cursor-pointer" />
              <button onClick={()=>navigate('/share-experience')} className="border border-blue-300 rounded-full cursor-pointer p-2 w-full h-14">
                <div className="flex justify-between">
                  <p className="ml-2 font-bold">Write for Community</p>
                  <Icon name="edit" size="large" className="text-green-500 space-x-2" />
                </div>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="m-5">
            {posts.map((post) => (
              <div key={post.id} className="mb-6 p-4 border border-blue-300 rounded-lg">
                {/* Post Header */}
                <div className="flex items-center mb-4">
                  <FaUserCircle size={40} className="mr-3" />
                  <div>
                    <p className="font-bold">{post.name}</p>
                    <p className="text-sm text-gray-500">{post.title}</p>
                  </div>
                </div>

                {/* Post Content */}
                <p style={{ whiteSpace: "pre-line" }} className="text-gray-700 mb-4">{post.content}</p>  

                {/* Divider Line */}
                <hr className="my-4 border-gray-200" />        

                {/* Post Actions */}
                <div className="flex justify-between text-gray-600">
                  <button className="flex items-center space-x-2 hover:text-blue-500">
                    <FaThumbsUp />
                    <span>{post.likes} Likes</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-500">
                    <FaComment />
                    <span>{post.comments} Comments</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-purple-500">
                    <FaRetweet />
                    <span>{post.reposts} Reposts</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-red-500">
                    <FaShare />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Now Card (Right) */}
        <div className="w-1/5 m-5 p-5 bg-white border border-blue-300 rounded-lg" style={{ height: "200px", overflowY: "auto" }}>
          <h2 className="text-xl font-bold mb-4">Trending Now</h2>
          <ul className="list-disc list-inside">
            <li className="mb-2">VIT'24 Interview Experiences</li>
            <li className="mb-2">Placement Preparations</li>
            <li className="mb-2">Mock Interviews Results</li>
            <li className="mb-2">Weekly Rankings</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Homepage; 