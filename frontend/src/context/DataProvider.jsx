import Peer from "peerjs";
import React, { useState, createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useMemo } from "react";

export const DataContext = createContext();
export const InterviewValueContext = createContext(); 

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const peerInstance = useRef(null);

  const interviewValueContext = useMemo(() => ({
    status,
    setStatus,
    roomId,
    setRoomId,
    peerInstance,
    peerId,
    socket,
  }), [status, roomId, peerId, socket]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    recommendedPosts,
    setRecommendedPosts,
  }), [user, recommendedPosts]);

  useEffect(() => {
    const socketIo = io(`${import.meta.env.VITE_BACKEND_URL}/`, {
      withCredentials: true,
    });

    setSocket(socketIo);

    const storedUser = localStorage.getItem("token");
    if (storedUser) {
      setUser(storedUser);
    }

    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current = peer;

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
      peer.destroy();
    };
  }, []);

  return (
    <DataContext.Provider value={contextValue}>
      <InterviewValueContext.Provider value={interviewValueContext}>
        {children}
      </InterviewValueContext.Provider>
    </DataContext.Provider>
  );
};