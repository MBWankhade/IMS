import { Suspense, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import { toast, ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainPage from "./pages/MainPage";
import AddPostForm from "./components/AddPostForm";
import ShareExperience from "./components/ShareExperience";
import Navbar from "./components/Navbar";
import PostSearch from "./components/PostSearch";
import { FaSpinner } from "react-icons/fa";
import Homepage from "./pages/Homepage";
import AppLayout from "./components/layout/AppLayout";
import People from "./pages/People";
import Saved from "./pages/Saved";
import CreatePost from "./pages/CreatePost";

import "./App.css";

function App() {
  const { user, setUser } = useContext(DataContext);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    getMyProfile();
  }, []);

  const getMyProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
        setUser(null); // ✅ Explicitly set user to null
      }
    } catch (error) {
      toast.error("Failed to Get Profile");
      console.error("Error:", error);
      setUser(null);
    } finally {
      setLoading(false); // ✅ Set loading to false after API call
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        {/* {user && <Navbar />} */}
        <Routes>
          {/* Public routes (no user required) */}
          <Route
            path="/login"
            element={<AuthRedirect user={user} Component={Login} />}
          />
          <Route
            path="/signup"
            element={<AuthRedirect user={user} Component={Signup} />}
          />

          {/* Protected routes (user required) */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(Homepage)}
              />
            }
          />
          <Route
            path="/room"
            element={<ProtectedRoute user={user} Component={MainPage} />}
          />
          <Route
            path="/write"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(AddPostForm)}
              />
            }
          />
          <Route
            path="/share-experience"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(ShareExperience)}
              />
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(PostSearch)}
              />
            }
          />
          <Route
            path="/search/:id"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(PostSearch)}
              />
            }
          />

          <Route
            path="/all-users"
            element={
              <ProtectedRoute user={user} Component={() => AppLayout(People)} />
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute user={user} Component={() => AppLayout(Saved)} />
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute
                user={user}
                Component={() => AppLayout(CreatePost)}
              />
            }
          />

          {/* Fallback route for unmatched paths */}
          {/* <Route
          path="*"
          element={<AuthRedirect user={user} Component={Homepage} />}
        /> */}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          pauseOnHover
        />
      </BrowserRouter>
    </Suspense>
  );
}

function ProtectedRoute({ user, Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true }); // ✅ Ensure proper redirection
    }
  }, [user, navigate]);

  return user ? <Component /> : null;
}

function AuthRedirect({ user, Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return !user ? <Component /> : null;
}

export default App;
