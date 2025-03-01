import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaLaugh, FaHeart, FaLightbulb, FaRegStar } from "react-icons/fa";
import axios from "axios";

const reactions = [
  { type: "like", icon: <FaThumbsUp className="text-blue-600" />, label: "Like" },
  { type: "funny", icon: <FaLaugh className="text-yellow-500" />, label: "Funny" },
  { type: "love", icon: <FaHeart className="text-red-500" />, label: "Love" },
  { type: "insightful", icon: <FaLightbulb className="text-orange-400" />, label: "Insightful" },
  { type: "celebrate", icon: <FaRegStar className="text-purple-500" />, label: "Celebrate" },
];

const Reactions = ({ postId }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [totalReactions, setTotalReactions] = useState(0);

  // Fetch reactions when the component mounts or postId changes
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/reactions`,
          { withCredentials: true }
        );
        console.log("Fetched reactions:", response.data); // Debugging
        setReactionCounts(response.data.reactionCounts);
        setTotalReactions(Object.values(response.data.reactionCounts).reduce((sum, count) => sum + count, 0));
        setSelectedReaction(reactions.find((r) => r.type === response.data.userReaction) || null);
      } catch (err) {
        console.error("Error fetching reactions", err);
      }
    };
    fetchReactions();
  }, [postId]);

  // Handle reaction selection
  const handleReaction = async (reactionType) => {
    try {
      // Update selected reaction
      const newSelectedReaction = reactions.find((r) => r.type === reactionType);
      setSelectedReaction(newSelectedReaction);

      // Update reaction counts locally
      setReactionCounts((prevCounts) => {
        const newCounts = { ...prevCounts };

        // Decrement the previous reaction count (if any)
        if (selectedReaction) {
          newCounts[selectedReaction.type] = Math.max((newCounts[selectedReaction.type] || 1) - 1, 0);
        }

        // Increment the new reaction count
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
        return newCounts;
      });

      // Update total reactions
      setTotalReactions((prevTotal) => prevTotal + (selectedReaction ? 0 : 1));

      // Send the reaction to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/react`,
        { reactionType },
        { withCredentials: true }
      );
      console.log("Reaction response:", response.data); // Debugging

      // Refetch reactions to ensure data consistency
      fetchReactions();
    } catch (err) {
      console.error("Error reacting to post", err);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Reaction Button */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition"
      >
        {selectedReaction ? selectedReaction.icon : <FaThumbsUp className="text-gray-600" />}
        <span>{selectedReaction ? selectedReaction.label : "Like"}</span>
      </button>

      {/* Reaction Popup */}
      {showReactions && (
        <div className="absolute bottom-10 left-0 flex space-x-2 bg-white p-2 border rounded-xl shadow-lg z-10">
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => {
                handleReaction(reaction.type);
                setShowReactions(false);
              }}
              className="flex flex-col items-center p-2 hover:scale-110 transition-transform"
            >
              {reaction.icon}
              <span className="text-xs text-gray-500">{reaction.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Reaction Counts */}
      <div className="flex space-x-2 mt-2">
        {Object.entries(reactionCounts).map(([type, count]) =>
          count > 0 ? (
            <div key={type} className="flex items-center space-x-1 text-gray-600">
              {reactions.find((r) => r.type === type)?.icon}
              <span>{count}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Total Reactions */}
      {totalReactions > 0 && (
        <div className="mt-2 text-gray-600 font-medium">
          {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
        </div>
      )}
    </div>
  );
};

export default Reactions;