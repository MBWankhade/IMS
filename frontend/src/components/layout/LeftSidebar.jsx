import React from "react";
import { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
} from "react-icons/ai";
import { HiUsers } from "react-icons/hi2";
import { Button, Loader } from "semantic-ui-react";
import { sidebarLinks } from "../../utils/utils";
import Logo from "../../assets/logo-vit.png";

function Navbar() {
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
    <nav className="leftsidebar overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src={Logo} alt="logo" width={70} height={36} />
        </Link>

        {!user?.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile`} className="flex gap-3 items-center">
            <img
              src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user?.name}</p>
              <p className="small-regular text-light-3">
                @{user?.username || "Guest"}
              </p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
          variant="ghost"
          className="shad-button_ghost "
          onClick={handleLogout}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;

{
  /* <nav className="leftsidebar">
      <div className="flex space-x-2 ml-20">
        <img
          className="size-12 border border-gray-300 rounded-md p-1 cursor-pointer bg-white"
          src={Logo}
          alt="IMS Logo"
          onClick={() => navigate("/")}
        />
        <div className="relative w-80">
          <button
            id="search-button"
            className="flex items-center justify-center w-full gap-2 p-3 text-md font-medium text-white bg-blue-600 rounded-3xl hover:bg-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:hover:bg-gray-800"
            onClick={() => navigate("/search")}
          >
            <AiOutlineSearch className="w-6 h-6 text-white" />
            Search Interview Experiences
          </button>
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
    </nav> */
}
