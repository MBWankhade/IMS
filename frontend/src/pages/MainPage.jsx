import React, { useEffect, useState } from "react";
import { HiPhoneMissedCall } from "react-icons/hi";
import { useNavigate } from "react-router-dom"; // For navigation
import AudioVideoScreen from "../components/InterviewPage";

function MainPage() {
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigation = () => {
    const confirmLeave = window.confirm("Do you want to leave the meeting?");
    if (confirmLeave) {
      exitFullScreen();
      navigate("/");
    } else {
      enableFullScreen();
    }
  };

  const enableFullScreen = () => {

    const elem = document.documentElement; // Get the whole document

    if (document.fullscreenElement) {
      return;
    }

    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else {
        throw new Error("Fullscreen API is not supported in this browser.");
      }
    } catch (error) {
      alert(
        "An error occurred while trying to enter fullscreen. Please ensure your browser supports fullscreen."
      );
    }
  };

  const exitFullScreen = () => {

    if (!document.fullscreenElement) {
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  useEffect(() => {
    enableFullScreen(); // Enable full-screen when the page loads

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert(
          "You are not allowed to switch tabs! Your test may be invalidated."
        );
      }
    };

    const handleFullScreenChange = () => {

      setTimeout(() => {
        if (!document.fullscreenElement) {
          alert("You must stay in full-screen mode for the test.");
          enableFullScreen();
        }
      }, 100); // Small delay to prevent instant loop
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.preventDefault();
        alert("You cannot exit full-screen mode during the test.");
        enableFullScreen();
      }
    };

    // document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <>
      <div className="h-[93vh] w-screen bg-gray-800 relative">
        <AudioVideoScreen />
      </div>

      <div
        className="h-[7vh] w-screen flex justify-center items-center
         text-center cursor-pointer p-1"
        style={{ backgroundColor: "rgba(127, 35, 189, 0.93)" }}
      >
        <button
          onClick={handleNavigation}
          className="h-[38px] w-[70px] rounded-[15px] flex justify-center items-center"
          style={{
            backgroundColor: "rgb(237, 84, 84)",
            border: "2px solid white",
          }}
        >
          <HiPhoneMissedCall className="w-8 h-8 text-black" />
        </button>
      </div>
    </>
  );
}

export default MainPage;
