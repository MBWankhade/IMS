import { useContext } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import MainPage from "./pages/MainPage";
import AddPostForm from "./components/AddPostForm";
import ShareExperience from "./components/ShareExperience";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(DataContext);

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
    </BrowserRouter>
  );
}

export default App;
