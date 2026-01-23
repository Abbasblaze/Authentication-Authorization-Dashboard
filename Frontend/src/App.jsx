import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin.jsx"; 
import Admim2 from "./pages/Admin2.jsx"
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "./components/NotFound";
import Admin2 from "./pages/Admin2.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      // First check localStorage for user data
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        
          if (token && !parsedUser.role) {
            const res = await axios.get("/api/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const updatedUser = { ...parsedUser, role: res.data.role };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } catch {
          // If stored user is invalid, fetch fresh data
          if (token) {
            try {
              const res = await axios.get("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUser(res.data);
              localStorage.setItem("user", JSON.stringify(res.data));
            } catch {
              setError("Failed to fetch user data");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
          }
        }
      } else if (token) {
        // If we have token but no user in localStorage
        try {
          const res = await axios.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch {
          setError("Failed to fetch user data");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  // Admin route protection component
  const AdminRoute = ({ children }) => {
    // if (!user) {
    //   return <Navigate to="/login" />;
    // }
    console.log('udrsg',user)
    // if (user.role !== "admin") {
    //   return <Navigate to="/" />;
    // }
    
    return children;
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />
           <Route
          path="/admin"
          element={ <Admin setUser={setUser} />}
        />
        <Route
          path="/admin2"
          element={
            <AdminRoute>
              <Admin2 />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;