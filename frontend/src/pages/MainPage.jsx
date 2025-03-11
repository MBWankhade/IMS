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
    console.log("enableFullScreen called.");

    const elem = document.documentElement; // Get the whole document

    if (document.fullscreenElement) {
      console.log("Already in fullscreen, no need to request again.");
      return;
    }

    console.log("Not in fullscreen, requesting fullscreen...");
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        console.log("general");
      } else if (elem.mozRequestFullScreen) {
        console.log("Firefox");
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        console.log("Safari & Chrome");
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        console.log("IE/Edge");
        elem.msRequestFullscreen();
      } else {
        throw new Error("Fullscreen API is not supported in this browser.");
      }
      console.log("Fullscreen request sent successfully.");
    } catch (error) {
      console.error("Fullscreen request failed: ", error);
      alert(
        "An error occurred while trying to enter fullscreen. Please ensure your browser supports fullscreen."
      );
    }
  };

  const exitFullScreen = () => {
    console.log("exitFullScreen called");

    if (!document.fullscreenElement) {
      console.log("Already NOT in fullscreen, no need to exit.");
      return;
    }

    console.log("Exiting fullscreen...");
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
      console.log("handleVisibilityChange called");
      if (document.hidden) {
        alert(
          "You are not allowed to switch tabs! Your test may be invalidated."
        );
      }
    };

    const handleFullScreenChange = () => {
      console.log("handleFullScreenChange called");

      setTimeout(() => {
        if (!document.fullscreenElement) {
          alert("You must stay in full-screen mode for the test.");
          console.log("You must stay in full-screen mode for the test.");
          enableFullScreen();
        }
      }, 100); // Small delay to prevent instant loop
    };

    const handleEscKey = (event) => {
      console.log("handleEscKey called");
      if (event.key === "Escape") {
        console.log("Esc key was pressed");
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
