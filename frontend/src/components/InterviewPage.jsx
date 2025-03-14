import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { DataContext } from "../context/DataProvider";
import Notepad from "./Notepad";
import CodeEditor from "./CodeEditor";
import { Box, Paper, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import {
  exitFullScreenSVG,
  fullScreenSVG,
  micSVG,
  micOffSVG,
  cameraSVG,
  cameraOffSVG,
  captionsSVG,
  reactionSVG,
  leaveCallSVG,
  moreIconSVG
} from "../utils/icons";

/* Styled wrapper with dark UI-friendly hover effects */
const StyledPaper = styled(Paper)({
  background: "linear-gradient(145deg, #121212, #1c1c1c)",
  padding: "18px",
  borderRadius: "18px",
  boxShadow:
    "5px 5px 15px rgba(0, 0, 0, 0.6), -5px -5px 15px rgba(255, 255, 255, 0.1)",
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
    boxShadow:
      "0px 0px 15px rgba(255, 255, 255, 0.3), 0px 0px 25px rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
  },
});

const FloatingButton = styled(Box)({
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold",
  color: "white",
  zIndex: 1000,
  transition: "background 0.3s ease-in-out",

  "& svg circle": {
    animation: "colorChange 1.8s infinite alternate ease-in-out",
  },

  "@keyframes colorChange": {
    "0%": { fill: "white" },
    "33%": { fill: "#00ffb4" }, // Neon cyan
    "66%": { fill: "#ff4081" }, // Soft pink
    "100%": { fill: "white" },
  },
});

/* Bottom Bar Container */
const BottomBarContainer = styled(Box)({
  position: "fixed",
  bottom: 15,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  backdropFilter: "blur(12px)",
  borderRadius: "40px",
  padding: "8px 16px",
  boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)",
});

const InterviewPage = () => {
  const { roomId, peerInstance, status, socket } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [isCodeEditorFullScreen, setIsCodeEditorFullScreen] = useState(false);
  const [isNotepadFullScreen, setIsNotepadFullScreen] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log('first')
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.emit("joinRoom", roomId);

    if (!peerInstance.current) {
      peerInstance.current = new Peer();
    }

    peerInstance.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
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
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
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

  const toggleMic = () => {
    const mediaStream = currentUserVideoRef.current.srcObject;
    if (mediaStream) {
      mediaStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleCamera = () => {
    const mediaStream = currentUserVideoRef.current.srcObject;
    if (mediaStream) {
      mediaStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleLeaveCall = () => {
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }
    window.location.href = "/"; // Redirect to home or another page
  };

  return (
    <Box display="flex" gap={3} p={4} bgcolor="#000" height="100vh">
      {/* Code Editor Section */}
      <StyledPaper
        sx={{
          width: isCodeEditorFullScreen ? "100%" : "50%",
          height: "98%",
          position: "relative",
        }}
      >
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
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          width="50%"
          height="98%"
        >
          {/* Video Section */}
          <StyledPaper
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              height: "30%",
            }}
          >
            <VideoContainer>
              <video
                ref={currentUserVideoRef}
                autoPlay
                playsInline
                className="w-full h-full"
              />
            </VideoContainer>
            <VideoContainer>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full"
              />
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
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
            >
              {isNotepadFullScreen ? exitFullScreenSVG : fullScreenSVG}
            </button>
            <Notepad socket={socket} roomId={roomId} />
          </StyledPaper>
        </Box>
      )}

      {/* Bottom Bar */}
      {/* Bottom Bar */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "fixed",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* Floating Dots Button */}
        {!isHovered && (
          <FloatingButton>
            {moreIconSVG}
          </FloatingButton>
        )}

        {/* Bottom Bar (Visible on Hover) */}
        {isHovered && (
          <BottomBarContainer sx={{ display: "flex" }}>
            {[
              {
                icon: isMicMuted ? micOffSVG : micSVG,
                onClick: () => setIsMicMuted(!isMicMuted),
              },
              {
                icon: isCameraOff ? cameraOffSVG : cameraSVG,
                onClick: () => setIsCameraOff(!isCameraOff),
              },
              { icon: captionsSVG },
              { icon: reactionSVG },
              {
                icon: leaveCallSVG,
                onClick: () => (window.location.href = "/"),
              },
            ].map((item, index) => (
              <IconButton
                key={index}
                onClick={item.onClick}
                sx={{
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  transition: "all 0.3s ease-in-out",
                  "& svg": { fontSize: "22px", color: "white" },
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.18)",
                    boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.3)",
                  },
                  "&:active": {
                    background: "rgba(255, 255, 255, 0.3)",
                    transform: "scale(0.95)",
                  },
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </BottomBarContainer>
        )}
      </Box>
    </Box>
  );
};

export default InterviewPage;
