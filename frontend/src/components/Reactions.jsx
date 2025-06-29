import React, { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

const reactions = [
  {
    type: "insightful",
    icon: <Lightbulb className="text-orange-400" />,
    label: "Insightful",
  }
];

const Reactions = ({ postId }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [totalReactions, setTotalReactions] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch reactions when the component mounts or postId changes
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        // Replace with your actual axios call
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/reactions`,
          { credentials: 'include' }
        );
        const data = await response.json();
        setReactionCounts(data.reactionCounts);
        setTotalReactions(
          Object.values(data.reactionCounts).reduce(
            (sum, count) => sum + count,
            0
          )
        );
        setSelectedReaction(
          reactions.find((r) => r.type === data.userReaction) || null
        );
      } catch (err) {
        console.error("Error fetching reactions", err);
      }
    };
    fetchReactions();
  }, [postId]);

  // Handle reaction selection/deselection
  const handleReaction = async (reactionType) => {
    try {
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      // Check if clicking the same reaction (toggle off)
      const isToggleOff = selectedReaction && selectedReaction.type === reactionType;
      
      if (isToggleOff) {
        // Remove reaction
        setSelectedReaction(null);
        
        // Update reaction counts locally
        setReactionCounts((prevCounts) => {
          const newCounts = { ...prevCounts };
          newCounts[reactionType] = Math.max(
            (newCounts[reactionType] || 1) - 1,
            0
          );
          return newCounts;
        });

        // Update total reactions
        setTotalReactions((prevTotal) => Math.max(prevTotal - 1, 0));

        // Send removal to backend
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/react`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reactionType: null })
          }
        );
        const data = await response.json();
        console.log("Reaction removal response:", data);
      } else {
        // Add new reaction
        const newSelectedReaction = reactions.find(
          (r) => r.type === reactionType
        );
        setSelectedReaction(newSelectedReaction);

        // Update reaction counts locally
        setReactionCounts((prevCounts) => {
          const newCounts = { ...prevCounts };

          // Decrement the previous reaction count (if any)
          if (selectedReaction) {
            newCounts[selectedReaction.type] = Math.max(
              (newCounts[selectedReaction.type] || 1) - 1,
              0
            );
          }

          // Increment the new reaction count
          newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
          return newCounts;
        });

        // Update total reactions
        setTotalReactions((prevTotal) => prevTotal + (selectedReaction ? 0 : 1));

        // Send the reaction to the backend
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/react`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reactionType })
          }
        );
        const data = await response.json();
        console.log("Reaction response:", data);
      }

      // Refetch reactions to ensure data consistency
      fetchReactions();
    } catch (err) {
      console.error("Error reacting to post", err);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Main reaction button with count */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleReaction("insightful")}
            className={`p-1 rounded-full transition-all duration-200 ${
              selectedReaction 
                ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' 
                : 'text-gray-600 hover:text-orange-400 hover:bg-gray-50'
            }`}
          >
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <Lightbulb 
                className={`w-6 h-6 transition-all duration-200 ${
                  selectedReaction ? 'text-orange-500 fill-orange-500' : 'text-gray-600'
                } ${isAnimating ? 'scale-125' : 'scale-100'} hover:scale-110`} 
              />
            </div>
          </button>
          
          {/* Count next to button */}
          {totalReactions > 0 && (
            <span className="text-sm font-medium text-gray-1000">
              {totalReactions.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reactions;