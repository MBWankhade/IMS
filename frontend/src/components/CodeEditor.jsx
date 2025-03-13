import React, { useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import LanguageDropdown from "./LanguageDropdown";
import Output from "./Output";
import { FaCode, FaPlay } from "react-icons/fa"; // Icons for code and output

function CodeEditor({ socket, roomId }) {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("c");
  const [version, setVersion] = useState("10.2.0");
  const [showOutput, setShowOutput] = useState(false); // State to toggle between code and output

  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleEditorChange(value, event) {
    setValue(value);
    socket.emit("message", { room: roomId, data: value });
  }

  useEffect(() => {
    socket.on("recieve-message", (data) => {
      setValue(data);
    });

    socket.on("recieve-language", ({ language, version }) => {
      setLanguage(language);
      setVersion(version);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex mt-10 gap-4 px-10">
        <div>
          <div className="flex items-center gap-4 px-4 mt-3">
            <p className="text-xl font-semibold text-white">Language:</p>
            <LanguageDropdown
              langSetter={setLanguage}
              verSetter={setVersion}
              socket={socket}
              lang={language}
              ver={version}
              roomId={roomId}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-400">
              {showOutput ? "Output" : "Code Editor"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowOutput(false)}
                className={`p-2 rounded-lg flex items-center ${
                  !showOutput
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                } hover:bg-blue-600 transition transform hover:scale-105`}
              >
                <FaCode className="mr-2" /> Code
              </button>
              <button
                onClick={() => setShowOutput(true)}
                className={`p-2 rounded-lg flex items-center ${
                  showOutput
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                } hover:bg-blue-600 transition transform hover:scale-105`}
              >
                <FaPlay className="mr-2" /> Output
              </button>
            </div>
          </div>
          {!showOutput ? (
            <Editor
              height="50vh"
              theme="vs-dark"
              width="50vw"
              language={language}
              value={value}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              className="my-4"
            />
          ) : (
            <Output
              version={version}
              language={language}
              value={value}
              socket={socket}
              roomId={roomId}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CodeEditor;