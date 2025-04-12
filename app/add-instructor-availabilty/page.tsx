"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

function AddSessions() {
  const [formData, setFormData] = useState({
    instructor_id: "",
    start_time: "",
    end_time: "",
    date: "",
  });

  const router = useRouter();

  const hardcodedInstructors = [
    { instructor_id: "1", first_name: "Alice", last_name: "Smith" },
    { instructor_id: "2", first_name: "Bob", last_name: "Johnson" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // For public demo, we won't route or post this anywhere
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Add Instructor Availabilty
          </h1>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instructor Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <select
                  name="instructor_id"
                  value={formData.instructor_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                >
                  <option value="">Select Instructor</option>
                  {hardcodedInstructors.map((inst) => (
                    <option key={inst.instructor_id} value={inst.instructor_id}>
                      {inst.first_name} {inst.last_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <PlusCircle size={24} />
              <span>Add Instructor Availabilty</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSessions;
