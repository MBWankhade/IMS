import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const res = await fetch("https://imsapp-4lhx.onrender.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, username, password }),
      });
      const data = await res.json();
      console.log(data.message);
      setUser(data.data);
      localStorage.setItem("token", data.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <p className="font-semibold text-5xl my-12">Sign Up</p>
        <div className="flex flex-col shadow-xl border border-gray-300 p-12 rounded-xl w-3/12 justify-center gap-10 items-center">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-10/12 text-2xl font-semibold border-solid border-2 border-gray-500 text-black rounded-md my-2 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-10/12 text-2xl font-semibold border-solid border-2 border-gray-500 text-black rounded-md my-2 outline-none"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 w-10/12 text-2xl font-semibold border-solid border-2 border-gray-500 text-black rounded-md my-2 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-10/12 text-2xl font-semibold border-solid border-2 border-gray-500 text-black rounded-md my-2 outline-none"
          />
          <button
            onClick={handleSignup}
            className="bg-blue-400 w-10/12 text-2xl py-1 px-2 font-semibold text-white rounded-md w-fit"
          >
            Signup
          </button>
          <p className="text-xl font-light ">
            Already have an account?{" "}
            <Link className="text-blue-400 font-semibold" to="/login">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
