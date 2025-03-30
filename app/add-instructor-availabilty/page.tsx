"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

function AddSessions() {
  const [formData, setFormData] = useState({
    instructor_id: "",
    start_time: "",
    end_time: "",
    date: "",
  });

  const [instructors, setInstructors] = useState([]);

  const [lessonInstructorMap, setLessonInstructorMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [instructorsRes] = await Promise.all([
          fetch("/api/getInstructors"),
        ]);

        let instructorMap = {};

        if (instructorsRes.ok) setInstructors(await instructorsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.instructor_id || !formData.start_time || !formData.end_time) {
      return alert("Please fill all required fields.");
    }

    const startTime = new Date(formData.start_time).toISOString();
    const endTime = new Date(formData.end_time).toISOString();
    const date = formData.date
      ? new Date(formData.date).toISOString().split("T")[0]
      : null;

    try {
      const response = await fetch("/api/add-instructor-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          start_time: startTime,
          end_time: endTime,
          date,
        }),
      });
      if (!response.ok) throw new Error("Failed to add lesson schedule");
      alert("Lesson schedule added successfully!");
      setFormData({
        instructor_id: "",
        start_time: "",
        end_time: "",
        date: "",
      });
      router.push("/ViewSessions");
    } catch (error) {
      console.error("Error adding lesson schedule:", error);
      alert("Failed to add lesson schedule");
    }
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
          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                  {instructors.length > 0 ? (
                    instructors.map((inst) => (
                      <option
                        key={inst.instructor_id}
                        value={inst.instructor_id}
                      >
                        {inst.first_name} {inst.last_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No instructors available</option>
                  )}
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
