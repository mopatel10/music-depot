"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [role, setRole] = useState("Client");
  const [employmentType, setEmploymentType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sign Up Successful", { name, email, password, role, employmentType });
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
      <div className="bg-gradient-to-b from-blue-300 to-pink-500 p-8 rounded-xl shadow-lg text-center w-96 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Register a</h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          >
            <option value="Client">Client</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-4 text-left">
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
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
          <div className="mb-4 text-left">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Password</label>
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
          <div className="mb-6 text-left">
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Phone number here"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {role === "Instructor" && (
            <div className="mb-4 text-left">
              <label htmlFor="employmentType" className="block text-sm font-bold text-gray-700 mb-1">Employment Type</label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 transition"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;
