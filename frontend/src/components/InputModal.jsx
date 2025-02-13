import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { useNavigate } from "react-router-dom";

function InputModal() {
  const { setStatus, setRoomId } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const closeModalAndJoin = () => {
    setStatus("interviewee");
    setIsOpen(false);
    navigate("/room");
  };

  return (
    <div>
      <button
        className="font-semibold text-lg  px-4 py-1 rounded-md border border-gray-300 shadow-md"
        onClick={openModal}
      >
        Join an Interview
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Enter Room ID</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="border border-gray-400 px-4 py-2 w-full rounded-xl outline-none text-semibold"
                placeholder="Room ID"
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow-xl"
                onClick={closeModalAndJoin}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputModal;
