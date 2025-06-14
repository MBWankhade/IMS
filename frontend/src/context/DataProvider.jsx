import Peer from "peerjs";
import React, { useState, createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const peerInstance = useRef(null);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}/`, {
      withCredentials: true,
    });

    setSocket(socket);

    const storedUser = localStorage.getItem("token");
    if (storedUser) {
      setUser(storedUser);
    }

    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current = peer;
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        status,
        setStatus,
        roomId,
        setRoomId,
        peerInstance,
        peerId,
        socket,
        recommendedPosts,
        setRecommendedPosts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
