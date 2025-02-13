import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataProvider";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PopupModal() {
  const { setStatus, peerId, roomId, setRoomId } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && peerId) {
      setRoomId(peerId);
    }
  }, [isOpen, peerId, setRoomId]);

  const openModal = () => {
    setStatus("interviewer");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);
  const closeModalAndJoin = () => {
    setIsOpen(false);
    navigate("/room");
  };

  return (
    <div>
      <button
        className="bg-blue-400 font-semibold text-lg text-white px-4 py-1 rounded-md shadow-md"
        onClick={openModal}
      >
        Start an Interview
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Room ID</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-2xl font-semibold text-gray-500">
                {roomId.length ? roomId : "Loading...."}
              </p>
              <FaCopy
                className="text-2xl text-gray-500 hover:text-gray-800 transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                }}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md shadow-xl mr-2"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow-xl"
                onClick={closeModalAndJoin}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupModal;
