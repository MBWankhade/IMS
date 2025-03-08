// frontend/src/components/AudioVideoScreen.js

import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { DataContext } from "../context/DataProvider";
import Notepad from "./Notepad";
import CodeEditor from "./CodeEditor";
import pdfToText from 'react-pdftotext';
import { FaUpload, FaTimes } from 'react-icons/fa'; // Importing icons

function AudioVideoScreen() {
  const { roomId, peerInstance, status, socket } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar

  function extractText(event) {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => {
        console.log(text);
        socket.emit("resume-text", { room: roomId, text: text });
        setResume(text); // Store the extracted text
      })
      .catch((error) => console.error("Failed to extract text from pdf"));
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.emit("joinRoom", roomId);
    const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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

    socket.on("generated-questions", (questions) => {
      console.log("Generated Questions:", questions);
      setGeneratedQuestions(questions);
      setErrorMsg(null);
    });

    socket.on("error-generating-questions", (error) => {
      console.error("Error:", error);
      setErrorMsg(error);
      setGeneratedQuestions(null);
    });

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
    };
  }, [roomId, status]);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Audio Video Screen</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Advanced Options
        </button>
      </div>

      <div className="flex w-full justify-between h-3/6 items-center mb-4">
        <div className="w-4/12 ">
          <video
            ref={currentUserVideoRef}
            autoPlay
            playsInline
            className="rounded-xl shadow-xl border-2 border-blue-500"
          />
        </div>
        <Notepad socket={socket} roomId={roomId} />
        <div className="w-4/12 ">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-xl shadow-xl border-2 border-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <CodeEditor socket={socket} roomId={roomId} />
      </div>

      {/* Sidebar for uploading resume */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 bg-white shadow-lg p-6 w-80 h-full z-50 border-l border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={extractText}
            className="border rounded-md p-2 mb-4 w-full"
          />
          {resume && (
            <div className="mt-4">
              <h3 className="font-semibold">Extracted Resume Text:</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md border">{resume}</pre>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="mt-4 p-2 bg-red-500 text-white rounded flex items-center hover:bg-red-600 transition"
          >
            <FaTimes className="mr-2" /> Close
          </button>
        </div>
      )}

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
      {generatedQuestions && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Generated Questions:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md border">{generatedQuestions}</pre>
        </div>
      )}
    </div>
  );
}

export default AudioVideoScreen;