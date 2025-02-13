import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";

function Login() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://imsapp-4lhx.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.data);
        localStorage.setItem("token", data.data);
        navigate("/");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <p className="font-semibold text-5xl my-12">Sign In</p>
        <div className="flex flex-col shadow-xl border border-gray-300 p-12 rounded-xl w-3/12 justify-center gap-10 items-center">
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
            onClick={handleLogin}
            className="bg-blue-400 text-2xl py-1 px-2 font-semibold text-white rounded-md w-fit"
          >
            Login
          </button>
          <p className="text-xl font-light ">
            New User?{" "}
            <Link className="text-blue-400 font-semibold" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
