"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../public/styles/globals.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true); // Start with popup visible
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading delay before redirecting
    setTimeout(() => {
      router.push("/ViewLessons");
    }, 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
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

      {/* Enhanced Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-gray-800 bg-opacity-80">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-4">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-3">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-bold text-white">The Music Depot</h3>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Demo Version</h4>

              <p className="text-gray-600 mb-3">
                Welcome to The Music Depot scheduler demo! Please note:
              </p>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-gray-600">This is a demonstration version only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-gray-600">No connection to any database or APIs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-gray-600">The real application helps music instructors manage lesson scheduling and finances</span>
                </li>
              </ul>

              <div className="mt-5 mb-5 border-t border-gray-200 pt-4">
                <h5 className="text-md font-semibold text-gray-800 mb-2">Technology Stack</h5>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">Next.js 14</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Prisma ORM</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">TypeScript</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">PostgreSQL</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">PgAdmin 4</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">NextAuth.js</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-md text-xs font-medium">Tailwind CSS</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">React Query</span>
                </div>
              </div>

              <div className="mb-5 border-t border-gray-200 pt-4">
                <h5 className="text-md font-semibold text-gray-800 mb-2">Development Team</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">MP</div>
                    <span className="text-sm text-gray-700">Mohammed Patel - Lead Developer</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">IL</div>
                    <span className="text-sm text-gray-700">Inguer Lara - Backend</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">MM</div>
                    <span className="text-sm text-gray-700">Malsini Masachchige - Frontend</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs mr-2">FB</div>
                    <span className="text-sm text-gray-700">Fathima Bukhari - UI/UX</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-2">CC</div>
                    <span className="text-sm text-gray-700">Calvin Chitnaraine - QA Specialist</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-5 text-sm italic">
                This demo showcases the interface that solved scheduling and financial tracking problems for a small music business.
              </p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="inline-block mr-1">💡</span> Enter any credentials to log in
                </div>
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-md hover:from-pink-500 hover:to-blue-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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