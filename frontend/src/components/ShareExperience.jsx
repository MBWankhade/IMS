import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
7;
import { cards } from "../utils/utils";
import { DataContext } from "../context/DataProvider";
import Navbar from "./Navbar";

const ShareExperience = () => {
  const { user } = useContext(DataContext);

  const navigate = useNavigate();

  return (
    <>
      <div className="h-full w-full p-6 shadow-sm bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 pt-3">Share your Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <a
              key={card.id}
              onClick={() => navigate("/write", { state: { id: card.id } })}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 size-80 h-60 hover:-translate-y-1 cursor-pointer"
            >
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-20 object-cover" // Medium image height
                />
              </div>
              <div className="p-3">
                {" "}
                {/* Medium padding */}
                <p className="text-md text-gray-700">{card.description}</p>{" "}
                {/* Smaller text with relaxed line height */}
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShareExperience;
