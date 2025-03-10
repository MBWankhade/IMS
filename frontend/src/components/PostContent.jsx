import React, { useState } from "react";
import { truncateHTML } from "../utils/utils";

const PostContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncate the content to 200 characters (adjust as needed)
  const truncatedContent = truncateHTML(content, 200);

  return (
    <div className="prose max-w-none">
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded ? content : truncatedContent,
        }}
      />
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-blue-600 hover:underline"
        >
          ...Read more
        </button>
      )}
    </div>
  );
};   

export default PostContent;