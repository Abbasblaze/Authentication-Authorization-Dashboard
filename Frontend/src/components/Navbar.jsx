import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Task
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300 hidden md:inline">
                Welcome, {user.username}
                {user.role === "admin" && (
                  <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </span>
              
              {/* Show Admin Dashboard link for admin users */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-gray-300 hover:text-white transition duration-200"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;