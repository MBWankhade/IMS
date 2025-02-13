import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


function Notepad({ socket, roomId }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // socket.emit("joinRoom", roomId);

    socket.on("recieve-text", (data) => {
      setValue(data);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    };
  }, [roomId]);

  const handleChange = (newValue) => {
    setValue(newValue);
    socket.emit("text-change", { room: roomId, data: newValue });
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      className="w-10/12 h-5/6 px-4 text-white"
    />
  );
}

export default Notepad;
