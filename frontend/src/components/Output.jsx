import React, { useEffect, useState } from "react";

function Output({ language, version, value, socket, roomId }) {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const handleRun = async () => {
    try {
      const reqBody = {
        language,
        version,
        files: [
          {
            content: value,
          },
        ],
        stdin: input,
      };
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const data = await res.json();
      setOutput(data.run.stdout + "\n" + data.run.stderr);
      socket.emit("output-change", {
        room: roomId,
        data: data.run.stdout + "\n" + data.run.stderr,
      });
    } catch (error) {
      console.log(error);
    }
  };

  function handleChange(event) {
    const newValue = event.target.value;
    setInput(newValue);
    socket.emit("input-change", { room: roomId, data: newValue });
  }

  useEffect(() => {
    socket.on("recieve-input", (data) => {
      setInput(data);
    });

    socket.on("recieve-output", (data) => {
      setOutput(data);
    });

    return () => {
      socket.off("receive-input");
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full py-1">
      <div className="flex py-1 mb-1">
        <p className="text-lg font-semibold text-black text-center">Output :</p>
        <button
          className=" font-semibold text-black outline  rounded-xl shadow-xl px-3 py-1 ml-auto"
          onClick={handleRun}
        >
          Run Code
        </button>
      </div>
      {/* <p className="text-lg font-semibold mt-3 text-black">Input</p> */}
      {/* <textarea
        className="h-full w-full outline-none border-2 border-gray-500 rounded-lg shadow-xl text-semibold p-2"
        value={input}
        onChange={handleChange}
      /> */}

      <div
        className="h-full w-full border-2 border-gray-500 rounded-lg shadow-xl text-semibold text-white p-2"
        style={{ backgroundColor: "rgb(20, 19, 19)" }}
      >
        {output}
      </div>
    </div>
  );
}

export default Output;
