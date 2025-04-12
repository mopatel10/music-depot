"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [role, setRole] = useState("Client");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [phoneNumber, setPhoneNumber] = useState("+1 (123) 456-7890");
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedInstrument, setSelectedInstrument] = useState("Guitar");
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      employmentType,
      ...(role === "Instructor" && {
        instrumentId: selectedInstrument,
        levelId: selectedLevel
      })
    };

    console.log("Form submitted with data:", data);
    // Handle the submission logic (e.g., addClient or addInstructor)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white md:w-1/4 md:flex md:flex-col md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-white/80 mt-2">Create an account for an Instructor or a Client</p>
            </div>
            <div className="mt-6 md:mt-0">
              <label htmlFor="role" className="block text-sm font-medium text-white/90 mb-1">
                Account Type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="Client" className="text-black">Client</option>
                <option value="Instructor" className="text-black">Instructor</option>
              </select>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-3/4 p-6">
            <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic information - Always visible */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                />
              </div>

              {/* Instructor-specific fields */}
              {role === "Instructor" && (
                <>
                  <div>
                    <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      id="employmentType"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-1">
                      Instrument
                    </label>
                    <select
                      id="instrument"
                      value={selectedInstrument}
                      onChange={(e) => setSelectedInstrument(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                    >
                      <option value="Guitar">Guitar</option>
                      <option value="Piano">Piano</option>
                      <option value="Drums">Drums</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      id="level"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit button spans full width */}
              <div className={`mt-4 ${role === "Instructor" ? "md:col-span-3" : "md:col-span-2 lg:col-span-3"}`}>
                <button
                  type="submit"
                  className="w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
