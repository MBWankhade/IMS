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
      <div className="flex flex-col gap-4 px-10 h-full w-full">
        <div className="h-[60%]">
          <div className="flex items-center gap-4 px-4 mt-1">
            <p className="text-xl font-semibold text-black">Language :</p>
            <LanguageDropdown
              langSetter={setLanguage}
              verSetter={setVersion}
              socket={socket}
              lang={language}
              ver={version}
              roomId={roomId}
            />
          </div>
          <Editor
            // height="90%"
            theme="vs-dark"
            // width="50vw"
            language={language}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            className="my-4"
          />
        </div>
        <div className="h-[40%]">
          <Output
            version={version}
            language={language}
            value={value}
            socket={socket}
            roomId={roomId}
          />
        </div>
      </div>
    </>
  );
}

export default CodeEditor;