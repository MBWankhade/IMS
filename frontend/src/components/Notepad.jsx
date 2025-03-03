import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Notepad({ socket, roomId }) {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    socket.on("recieve-text", (data) => {
      setValue(data);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    };
  }, [roomId, socket]);

  const handleChange = (newValue) => {
    setValue(newValue);
    socket.emit("text-change", { room: roomId, data: newValue });
  };

  return (
    <div className="w-10/12 h-5/6 px-4 text-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        ref={(el) => {
          if (el) quillRef.current = el;
        }}
      />
    </div>
  );
}

export default Notepad;
