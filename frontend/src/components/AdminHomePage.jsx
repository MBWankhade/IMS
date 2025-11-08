import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminHomePage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/admin-route/ims-startupfounders/pending-posts`, { withCredentials: true })
      .then(res => {
        setPendingPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching pending posts:", err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (postId) => {
    await axios.post(`${BACKEND_URL}/pending-posts/${postId}/approve`);
    setPendingPosts(pendingPosts.filter(post => post._id !== postId));
  };

  const handleReject = async (postId) => {
    await axios.post(`${BACKEND_URL}/pending-posts/${postId}/reject`);
    setPendingPosts(pendingPosts.filter(post => post._id !== postId));
  };

  if (loading) return <div>Loading pending posts...</div>;

  return (
    <div>
      <h2>Pending Posts for Review</h2>
      {pendingPosts.length === 0 ? (
        <div>No pending posts.</div>
      ) : (
        pendingPosts.map(post => (
          <div key={post._id} style={{ border: "1px solid #ccc", margin: "1em 0", padding: "1em" }}>
            <h3>{post.title}</h3>
            <p><strong>Company:</strong> {post.company}</p>
            <p><strong>Role:</strong> {post.role}</p>
            <p><strong>Placement Type:</strong> {post.placementType}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <button onClick={() => handleApprove(post._id)}>Approve</button>
            <button onClick={() => handleReject(post._id)} style={{ marginLeft: "1em", color: "red" }}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminHomePage;