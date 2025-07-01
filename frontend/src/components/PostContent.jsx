import React, { useState } from "react";
import { truncateHTML } from "../utils/utils";
import { useLocation } from "react-router-dom";

const extractImages = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const images = Array.from(div.getElementsByTagName("img"));
  return images.map((img) => img.outerHTML).join(" ");
};

const PostContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const imagesHTML = extractImages(content);
  const textWithoutImages = content.replace(/<img[^>]*>/g, "");
  const truncatedContent = truncateHTML(textWithoutImages, 200);

  return (
    <div className="prose max-w-none">
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded ? textWithoutImages : truncatedContent,
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
      {location.pathname === "/" && (
        <div dangerouslySetInnerHTML={{ __html: imagesHTML }} className="mt-2"/>
      )} 
    </div>
  );
};

export default PostContent; 