import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { DataContext } from "../context/DataProvider";
import Notepad from "./Notepad";
import CodeEditor from "./CodeEditor";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

// Fullscreen SVG
const fullScreenSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

// Exit Fullscreen SVG
const exitFullScreenSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

/* Styled wrapper with dark UI-friendly hover effects */
const StyledPaper = styled(Paper)({
  background: "linear-gradient(145deg, #121212, #1c1c1c)",
  padding: "18px",
  borderRadius: "18px",
  boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.6), -5px -5px 15px rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "box-shadow 0.3s ease-in-out, border 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 0px 25px rgba(0, 255, 180, 0.5)", // Subtle neon cyan glow
    border: "1px solid rgba(0, 255, 180, 0.5)",
  },
});

/* Video Container with soft interactive glow */
const VideoContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "16px",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)",
  overflow: "hidden",
  transition: "box-shadow 0.3s ease-in-out, border 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.3), 0px 0px 25px rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
  },
});

const InterviewPage = () => {
  const { roomId, peerInstance, status, socket } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [isCodeEditorFullScreen, setIsCodeEditorFullScreen] = useState(false);
  const [isNotepadFullScreen, setIsNotepadFullScreen] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.emit("joinRoom", roomId);

    if (!peerInstance.current) {
      peerInstance.current = new Peer();
    }

    peerInstance.current.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          call.answer(mediaStream);

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        })
        .catch((err) => console.error("Failed to access media devices", err));
    });

    if (status === "interviewee") {
      initiateCall(roomId);
    }

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
    };
  }, [roomId, status]);

  const initiateCall = (remotePeerId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        const call = peerInstance.current.call(remotePeerId, mediaStream);
        
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
      .catch((err) => console.error("Failed to access media devices", err));
  };

  const toggleCodeEditorFullScreen = () => {
    setIsCodeEditorFullScreen(!isCodeEditorFullScreen);
  };

  const toggleNotepadFullScreen = () => {
    setIsNotepadFullScreen(!isNotepadFullScreen);
  };

  return (
    <Box display="flex" gap={3} p={4} bgcolor="#000" height="100vh">
      {/* Code Editor Section */}
      <StyledPaper sx={{ width: isCodeEditorFullScreen ? "100%" : "50%", height: "100%", position: "relative" }}>
        <button
          onClick={toggleCodeEditorFullScreen}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
          }}
        >
          {isCodeEditorFullScreen ? exitFullScreenSVG : fullScreenSVG}
        </button>
        <CodeEditor socket={socket} roomId={roomId} />
      </StyledPaper>

      {/* Right Panel containing video streams and notepad */}
      {!isCodeEditorFullScreen && (
        <Box display="flex" flexDirection="column" gap={3} width="50%" height="100%">
          {/* Video Section */}
          <StyledPaper sx={{ display: "flex", justifyContent: "space-evenly", height: "30%" }}>
            <VideoContainer>
              <video ref={currentUserVideoRef} autoPlay playsInline className="w-full h-full" />
            </VideoContainer>
            <VideoContainer>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full" />
            </VideoContainer>
          </StyledPaper>

          {/* Notepad Section */}
          <StyledPaper
            sx={{
              flexGrow: 1,
              position: isNotepadFullScreen ? "absolute" : "relative",
              top: isNotepadFullScreen ? 0 : "auto",
              left: isNotepadFullScreen ? 0 : "auto",
              width: isNotepadFullScreen ? "100vw" : "auto",
              height: isNotepadFullScreen ? "100vh" : "auto",
              zIndex: isNotepadFullScreen ? 1000 : "auto",
            }}
          >
            <button
              onClick={toggleNotepadFullScreen}
              style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: "white" }}
            >
              {isNotepadFullScreen ? exitFullScreenSVG : fullScreenSVG}
            </button>
            <Notepad socket={socket} roomId={roomId} />
          </StyledPaper>
        </Box>
      )}
    </Box>
  );
};

export default InterviewPage;