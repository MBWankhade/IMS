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
      <div className="h-full w-full py-8 px-1 sm:px-4 lg:px-8 overflow-scroll custom-scrollbar">
        {/* <h2 className="text-2xl font-bold mb-8 pt-3">Share your Experience</h2> */}
        <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <a
              key={card.id}
              onClick={() => navigate("/write", { state: { id: card.id } })}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300  h-[200px] max-w-[430px] hover:-translate-y-1 cursor-pointer"
            >
              <div className="overflow-hidden rounded-t-lg h-[50%]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full object-cover"
                />
              </div>
              <div className="px-3 py-2 h-[50%]">
                <p className="text-gray-700">{card.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShareExperience;
