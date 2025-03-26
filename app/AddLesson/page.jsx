'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function AddLessons() {
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState({
    lesson_name: '',
    level_id: '',
    status: '',
    cost: '',
    total_lessons: '',
    capacity: '',
    start_date: '',
    instructor_id: '',
  });

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/getInstructors');
      if (!response.ok) throw new Error('Failed to fetch instructors');
      const result = await response.json();
      setInstructors(result);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'instructor_id' && value) {
      try {
        const response = await fetch(`/api/getLevels?instructorId=${value}`);
        if (!response.ok) throw new Error('Failed to fetch levels');
        const result = await response.json();
        setLevels(result);
      } catch (error) {
        console.error('Error fetching levels:', error);
        setLevels([]);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.lesson_name || !formData.level_id || !formData.status) {
      return alert('Please fill all required fields.');
    }

    // Convert to appropriate data types
    const capacity = parseInt(formData.capacity, 10);
    const cost = parseFloat(formData.cost);
    const totalLessons = parseInt(formData.total_lessons, 10);

    // Validate inputs
    if (capacity > 10) {
      return alert('Capacity cannot be greater than 10.');
    }
    if (isNaN(cost) || cost <= 0) {
      return alert('Invalid cost. Please enter a valid number.');
    }
    if (isNaN(capacity) || capacity <= 0) {
      return alert('Invalid capacity. Please enter a valid number.');
    }
    if (isNaN(totalLessons) || totalLessons <= 0) {
      return alert('Invalid total lessons. Please enter a valid number.');
    }

    try {
      const response = await fetch('/api/addLesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity,
          cost,
          total_lessons: totalLessons,
        }),
      });

      if (!response.ok) throw new Error('Failed to add lesson');
      alert('Lesson added successfully!');
      setFormData({
        lesson_name: '',
        level_id: '',
        status: '',
        cost: '',
        total_lessons: '',
        capacity: '',
        start_date: '',
        instructor_id: '',
      });
      router.push('/ViewLessons');
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Failed to add lesson');
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Create New Lesson
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lesson Name</label>
                <input
                  type="text"
                  name="lesson_name"
                  value={formData.lesson_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                  placeholder="Enter lesson name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                {instructors.length === 0 ? (
                  <p>Loading instructors...</p>
                ) : (
                  <select
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.instructor_id} value={inst.instructor_id}>
                        {inst.first_name} {inst.last_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  name="level_id"
                  value={formData.level_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.length > 0 ? (
                    levels.map((lvl) => (
                      <option key={lvl.level_id} value={lvl.level_id}>
                        {lvl.level_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No levels available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  maxLength={1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Lessons</label>
                <input
                  type="number"
                  name="total_lessons"
                  value={formData.total_lessons}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (Max 10)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 bg-gradient-to-b from-blue-300 to-purple-600"
            >
              Add Lesson
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}