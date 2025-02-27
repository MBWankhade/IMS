import { useContext, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import MainPage from "./pages/MainPage";
import AddPostForm from "./components/AddPostForm";
import ShareExperience from "./components/ShareExperience";
import Navbar from "./components/Navbar";
import { toast } from "react-toastify";
import {ToastContainer} from "react-toastify";

function App() {
  const { user ,setUser } = useContext(DataContext);
  // console.log(user)
  useEffect(() => {
    getMyProfile();
  }, []
  )

  const getMyProfile= async ()=>{
    try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies (if used) are included
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data); // ✅ Set user in context
      
            localStorage.setItem("token", data.token); // ❗️Only if not using cookies
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Failed to Get Profile");
          console.error("Error:", error);
        }
  }


  return (
    <BrowserRouter>
      {/* Navbar is conditionally rendered based on the route */}
      {user && <Navbar />}
      <Routes>
        {/* Public routes (no user required) */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* Protected routes (user required) */}
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/room"
          element={user ? <MainPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/write"
          element={user ? <AddPostForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/share-experience"
          element={user ? <ShareExperience /> : <Navigate to="/login" />}
        />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover />
      
    </BrowserRouter>
  );
}

export default App;
