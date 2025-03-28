import React, { useEffect, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/system";
import { DEFAULT_TEMPLATE_NOTEPAD } from "../utils/constants";
import { debounce } from "lodash"; // Using lodash for debouncing

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }], // Enable text color & highlight
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "code-block",
];

const StyledQuill = styled(ReactQuill)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  ".ql-toolbar": {
    background: "#222",
    borderRadius: "8px 8px 0 0",
    border: "none",
    color: "#fff",
  },
  ".ql-container": {
    flex: 1,
    borderRadius: "0 0 8px 8px",
    background: "#000",
    color: "#fff",
    border: "none",
    maxHeight: "350px", // Ensures content does not expand
    overflowY: "auto", // Enables scrolling
    scrollBehavior: "smooth", // Smooth scrolling effect
  },
  ".ql-editor": {
    minHeight: "100%",
    padding: "16px",
    color: "#fff",
    overflowY: "auto",
    scrollBehavior: "smooth",
  },
  ".ql-editor code": {
    background: "#222",
    color: "#0f0",
    padding: "4px",
    borderRadius: "4px",
  },
});

const NotepadWrapper = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

function Notepad({ socket, roomId }) {
  const [value, setValue] = useState(DEFAULT_TEMPLATE_NOTEPAD);

  // Debounce the socket emit to prevent sending too many messages
  const debouncedEmit = useCallback(
    debounce((newValue) => {
      socket.emit("text-change", { room: roomId, data: newValue });
    }, 1000), // Adjust debounce delay as needed
    [socket, roomId]
  );

  useEffect(() => {
    // Listen for text updates from other users
    socket.on("receive-text", (data) => {
      setValue(data);
    });

    // Handle cleanup on component unmount or when roomId changes
    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("receive-text"); // Unsubscribe from the event
      socket.disconnect();
    };
  }, [roomId, socket]);

  const handleChange = (newValue) => {
    if(!socket.connected){
      alert("Please reconnect")
      return;
    }
    setValue(newValue);
    debouncedEmit(newValue); // Send change to the server with debounce
  };

  return (
    <NotepadWrapper>
      <StyledQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </NotepadWrapper>
  );
}

export default Notepad;
