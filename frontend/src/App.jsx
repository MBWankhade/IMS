import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import { toast, ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainPage from "./pages/MainPage";
import AddPostForm from "./components/AddPostForm";
import PostSearch from "./components/PostSearch";
import SinglePost from "./components/SinglePost";
import { FaSpinner } from "react-icons/fa";
import Homepage from "./pages/Homepage";
import AppLayout from "./components/layout/AppLayout";
import People from "./pages/People";
import Saved from "./pages/Saved";
import CreatePost from "./pages/CreatePost";
import ShareExperience from "./components/ShareExperience";

import "./App.css";

function App() {
  // Get user and setUser from context
  const { user, setUser } = useContext(DataContext);
  // State to manage loading spinner
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    getMyProfile();
  }, []);

  // Fetch current user's profile from backend
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
        setUser(data); // Set user in context
        localStorage.setItem("token", data.token); // Store token
      } else {
        toast.error(data.message); // Show error toast
        setUser(null);
      }
    } catch (error) {
      toast.error("Failed to Get Profile");
      setUser(null);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Show loading spinner while fetching profile
  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex justify-center items-center bg-white">
  //       <FaSpinner className="animate-spin text-blue-500 text-4xl" />
  //     </div>
  //   );
  // }

  // Main app routes
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes for login and signup */}
        <Route
          path="/login"
          element={<AuthRedirect user={user} Component={Login} />}
        />
        <Route
          path="/signup"
          element={<AuthRedirect user={user} Component={Signup} />}
        />
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} Component={() => AppLayout(Homepage)} />
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
              Component={() => AppLayout(SinglePost)}
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
      </Routes>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
      />
    </BrowserRouter>
  );
}

// Protects routes: redirects to login if user is not authenticated
function ProtectedRoute({ user, Component }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return user ? <Component /> : null;
}

// Redirects authenticated users away from login/signup to home
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
