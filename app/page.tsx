"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../public/styles/globals.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading delay before redirecting
    setTimeout(() => {
      router.push("/ViewLessons");
    }, 1000);
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

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter any username"
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
              placeholder="Enter any password"
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
