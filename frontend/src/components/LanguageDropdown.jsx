import React from "react";
import { languages } from "../constants.js";

const LanguageDropdown = ({
  langSetter,
  verSetter,
  socket,
  lang,
  ver,
  roomId,
}) => {
  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    const selectedVersion = languages.find(
      (lang) => lang.name === selectedLanguage
    ).version;
    langSetter(selectedLanguage);
    verSetter(selectedVersion);
    socket.emit("change-language", {
      room: roomId,
      data: { language: selectedLanguage, version: selectedVersion },
    });
  };

  return (
    <div>
      <select
        className="p-1 text-lg outline-none bg-blue-500 rounded-md text-white"
        value={lang}
        onChange={handleChange}
      >
        {languages.map((lang) => (
          <option key={lang.name} value={lang.name} className="bg-blue-900">
            {lang.name.toUpperCase()}{" "}
            <span className="font-">{lang.version}</span>
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
