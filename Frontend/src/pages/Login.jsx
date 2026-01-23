import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { 
    loginWithRedirect, 
    logout, 
    isAuthenticated, 
    user: auth0User, 
    isLoading,
    getAccessTokenSilently 
  } = useAuth0();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      console.log(res.data);
      // navigate("/admin");
      if (res.data.role === "admin") {
        console.log("Redirecting to admin page");
        navigate("/admin");
      } else {
        console.log("Redirecting to home page");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleAuth0Login = async () => {
    try {
      await loginWithRedirect();
    } catch (err) {
      console.error("Auth0 login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleAuth0Logout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  useEffect(() => {
    const syncAuth0User = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const token = await getAccessTokenSilently();
          
          const userData = {
            email: auth0User.email,
            name: auth0User.name,
            picture: auth0User.picture,
            token: token,
            auth0User: true,
          };
          
          localStorage.setItem("token", token);
          localStorage.setItem("auth0User", JSON.stringify(userData));
          setUser(userData);
          console.log(userData);
          
          navigate("/");
          
        } catch (err) {
          console.error("Error syncing Auth0 user:", err);
        }
      }
    };
    
    if (isAuthenticated) {
      syncAuth0User();
    }
  }, [isAuthenticated, auth0User, setUser, navigate, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium cursor-pointer transition duration-200"
          >
            Login with Email
          </button>
        </form>
        
        <div className="flex items-center mb-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <div className="space-y-4">
          {!isAuthenticated ? (
            <button
              onClick={handleAuth0Login}
              className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 font-medium cursor-pointer transition duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,14H20V10H22V14M22,8H20V6H22V8M20,16H22V18H20V16M18,10V14H16V10H18M16,6V8H18V6H16M18,4H8V6H18V4M4,6V4H6V6H4M6,20H4V18H6V20M4,16H6V14H4V16M4,10H6V8H4V10M8,18V20H6V18H8M6,16H8V14H6V16M12,18H10V16H12V18M10,14H12V12H10V14M12,12H14V10H12V12M14,10H16V8H14V10M12,6H10V8H12V6M10,8H8V10H10V8M8,8H6V10H8V8Z" />
              </svg>
              Continue with Auth0
            </button>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-green-600">
                ✓ Logged in as {auth0User?.email}
              </p>
              <button
                onClick={handleAuth0Logout}
                className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 font-medium cursor-pointer transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">Don't have an account?</p>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;