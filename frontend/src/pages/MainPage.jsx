import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import AudioVideoScreen from "../components/AudioVideoScreen";

function MainPage() {
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigation = () => {
    console.log("Navigating to the home page");
    navigate("/"); // Navigate to the home page ("/")
  };

  return (
    <div className="h-screen w-screen bg-gray-800 relative">
      <AudioVideoScreen />

      <button
        onClick={handleNavigation}
        className=" h-10 w-10 flex justify-center items-center text-center cursor-pointer
         absolute top-[60px] left-[20px] p-2 bg-black rounded-full text-white shadow-lg "
      >
        <ArrowNarrowLeftIcon />
      </button>
    </div>
  );
}

export default MainPage;
