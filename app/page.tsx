"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext"; 
import "../public/styles/globals.css";
import axios from "axios";

const LoginPage: React.FC = () => {
  const { setIsLoggedIn, setUserRole, setUserId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors before a new attempt
  
    try {
      const res = await axios.post("/api/authUser", { email, password });
  
      if (res.status !== 200) throw new Error(res.data.error || "Login failed");
  
      // Store token and update login state
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      
      // Set the user role and user ID
      setUserRole(res.data.role);
      setUserId(res.data.userId); 
      
      router.push("/ViewLessons");
  
    } catch (error: any) {
      console.error("Login Error:", error);
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
      {/* Floating Symbols */}
      <div className="absolute text-pink-500 opacity-10 text-[300px] top-[10%] left-[5%] animate-float1">
        ♪ ♫ ♬ ♭ ♮ ♯ ♪
      </div>
      <div className="absolute text-blue-500 opacity-10 text-[250px] top-[70%] left-[60%] animate-float2">
        ♪ ♫ ♬ ♭ ♮ ♯ ♪
      </div>
      

      <div className="bg-gradient-to-b from-blue-300 to-pink-500 p-8 rounded-xl shadow-lg text-center w-96 relative z-10">
        <div className="text-3xl font-bold text-blue-500 flex justify-center items-center mb-4">
          🎵 <span className="ml-2 text-gray-700">Music Scheduler</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
        <p className="text-sm text-gray-600 mb-6">
          Manage your lessons and schedules effortlessly
        </p>

        {/* Display error message if present */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-6 text-left">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;