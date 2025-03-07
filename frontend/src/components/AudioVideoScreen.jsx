import React, { useContext, useEffect, useRef } from "react";
import Peer from "peerjs";
import { DataContext } from "../context/DataProvider";
import Notepad from "./Notepad";
import CodeEditor from "./CodeEditor";

function AudioVideoScreen() {
  const { roomId, peerInstance, status, socket } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.emit("joinRoom", roomId);
    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (!peerInstance.current) {
      peerInstance.current = new Peer();
    }

    peerInstance.current.on("call", (call) => {
      getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          call.answer(mediaStream);

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });

    if (status === "interviewee") {
      call(roomId);
    }

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
    };
  }, [roomId, status]);

  const call = (remotePeerId) => {
    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, mediaStream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  return (
    <div className="h-screen w-screen bg-white">
      <div
        className="flex w-full justify-between h-2/6 items-center p-3 "
        // style={{ backgroundColor: "rgb(146, 235, 140)" }}
      >
        <div className="w-3/12 h-full">
          <video
            ref={currentUserVideoRef}
            autoPlay
            playsInline
            className="rounded-xl shadow-xl w-full h-full border-2 border-gray-300"
          />
        </div>
        <div
          className="w-6/12 h-full overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <Notepad socket={socket} roomId={roomId} />
        </div>
        <div className="w-3/12 h-full ">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-xl shadow-xl w-full h-full border-2 border-gray-300"
          />
        </div>
      </div>

      <div
        className=" w-full h-4/6  px-3"
        style={{ backgroundColor: "rgb(222, 219, 229)" }}
      >
        <CodeEditor socket={socket} roomId={roomId} />
      </div>
    </div>
  );
}

export default AudioVideoScreen;
