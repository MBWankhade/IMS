import React, { useContext, useEffect, useRef } from "react";
import Peer from "peerjs";
import { DataContext } from "../context/DataProvider";
import Notepad from "./Notepad";
import CodeEditor from "./CodeEditor";

function AudioVideoScreen() {
  const { roomId, peerInstance, status, socket } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);

  let bgColor = "rgb(228, 233, 235)";

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
    <div
      className="h-full w-full flex gap-2 p-2"
      style={{ backgroundColor: "black" }}
    >
      <div
        className=" w-[50vw] h-full px-3 rounded-[10px]"
        style={{
          backgroundColor: `${bgColor}`,
          // border: "1px solid red",
        }}
      >
        <CodeEditor socket={socket} roomId={roomId} />
      </div>

      <div className="flex flex-col  w-[50vw] h-full gap-2 rounded-[10px]">
        <div
          className="flex justify-evenly h-[30%] rounded-[10px] p-1"
          style={{
            backgroundColor: `${bgColor}`,
            // border: "1px solid blue"
          }}
        >
          <div
            className="h-[100%] aspect-square rounded-[50%] flex items-center justify-center"
            // style={{ backgroundColor: "rgb(249, 251, 249)" }}
            style={{
              border: "2px solid",
            }}
          >
            <video
              ref={currentUserVideoRef}
              autoPlay
              playsInline
              className="rounded-[50%]  w-full h-full border-2 border-gray-300"
            />
          </div>

          <div
            className="h-[100%] aspect-square rounded-[50%] flex items-center justify-center"
            // style={{ backgroundColor: "rgb(249, 251, 249)" }}
            style={{ border: "2px solid" }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="rounded-[50%]  w-full h-full border-2 border-gray-300"
            />
          </div>
        </div>

        <div
          className="w-full h-[70%]  rounded-[10px] overflow-y-auto" // overflow-y-auto
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            backgroundColor: `${bgColor}`,
            // border: "1px solid green",
          }}
        >
          <div className="h-[87%] p-2">
            <Notepad socket={socket} roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioVideoScreen;
