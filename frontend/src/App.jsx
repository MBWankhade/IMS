import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import { toast, ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import MainPage from "./pages/MainPage";
import AddPostForm from "./components/AddPostForm";
import ShareExperience from "./components/ShareExperience";
import Navbar from "./components/Navbar";

function App() {
  const { user, setUser } = useContext(DataContext);
  const [loading, setLoading] = useState(true); // ✅ Add loading state   

  useEffect(() => {
    getMyProfile(); 
  }, []); 

  const getMyProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
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
    return <div className="flex items-center justify-center min-h-screen" role="status">
    <svg 
        aria-hidden="true" 
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" 
        viewBox="0 0 100 101" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
            fill="currentColor"
        />
        <path 
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
            fill="currentFill"
        />
    </svg>
    <span className="sr-only">Loading...</span>
</div>
; // ✅ Show loading state
  }

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        {/* Public routes (no user required) */}
        <Route path="/login" element={<AuthRedirect user={user} Component={Login} />} />
        <Route path="/signup" element={<AuthRedirect user={user} Component={Signup} />} />

        {/* Protected routes (user required) */}
        <Route path="/" element={<ProtectedRoute user={user} Component={Homepage} />} />
        <Route path="/room" element={<ProtectedRoute user={user} Component={MainPage} />} />
        <Route path="/write" element={<ProtectedRoute user={user} Component={AddPostForm} />} />
        <Route path="/share-experience" element={<ProtectedRoute user={user} Component={ShareExperience} />} /> 

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<AuthRedirect user={user} Component={Homepage} />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover />
    </BrowserRouter>
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