import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
import Logo from "../assets/logo-vit.png";
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
} from "react-icons/ai";
import { HiUsers } from "react-icons/hi2";

function Navbar() {
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed!");
      }

      await res.json();
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex p-2 bg-white justify-between items-center shadow-sm fixed top-0 w-screen z-50">
      <div className="flex space-x-2 ml-20">
        <img
          className="size-12 border border-gray-300 rounded-md p-1 cursor-pointer bg-white"
          src={Logo}
          alt="IMS Logo"
          onClick={() => navigate("/")}
        />
        <div className="relative w-80">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <AiOutlineSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-gray-800"
            placeholder="Search"
            required
          />
        </div>
      </div>

      <div className="flex w-4/12 justify-around items-center mr-20">
        <div className="flex flex-col items-center cursor-pointer">
          <AiOutlineHome
            size={30}
            className="text-black"
            onClick={() => navigate("/")}
          />
          <p className="text-xs">Home</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <HiUsers
            size={30}
            className="text-black"
            onClick={() => navigate("/features")}
          />
          <p className="text-xs">My Network</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <AiOutlineMessage size={30} className="text-black" />
          <p className="text-xs">Messaging</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <AiOutlineBell size={30} className="text-black" />
          <p className="text-xs">Notifications</p>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="text-xl font-semibold text-white bg-blue-700 rounded-xl py-2 px-4"
          >
            Logout
          </button>
        ) : (
          <div>
            <button
              className="text-xl font-semibold text-white bg-blue-700 rounded-xl  py-2 px-4"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="text-xl font-semibold text-blue-700 bg-white rounded-xl  py-2 px-4"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
