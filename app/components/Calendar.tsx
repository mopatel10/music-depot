'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/public/styles/globals.css';

export default function CalendarGfg({ view }) {
  const [value, onChange] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value);
  const [data, setData] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    lesson_name: '',
    level: '',
    status: '',
    cost: '',
    total_lessons: '',
    capacity: '',
    start_date: '',
    instructor: '',
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const createTimestamp = (date, time) => `${formatDate(date)}T${time}:00.000Z`;

  const fetchData = async (date) => {
    try {
      const url = `/api/schedules?view=${view}${date ? `&date=${formatDate(date)}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    }
  };

  useEffect(() => {
    if (view === 'ViewLessons') fetchData();
    else if (view ==='AddLessons'){
      fetchInstructors();
    }
    }, [view]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (view === 'AddLessons') {
      setFormData({
        lesson_name: '',
        level: '',
        status: '',
        cost: '',
        total_lessons: '',
        capacity: '',
        start_date: '',
        instructor: '',
      });
    } else {
      fetchData(date);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation logic for fields
    if (formData.capacity > 10) return alert('Capacity cannot be greater than 10.');
    if (!formData.lesson_name || !formData.level || !formData.status) return alert('Please fill all fields.');

    try {
      const startTimestamp = createTimestamp(selectedDate, formData.start_date);

      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add lesson');
      alert('Lesson added successfully!');
      fetchData(selectedDate);
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Failed to add lesson');
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/getInstructors'); // API to get instructors
      if (!response.ok) throw new Error('Failed to fetch instructors');
      const result = await response.json();
      setInstructors(result);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-start bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6 md:space-y-0 md:space-x-6">
      {/* Calendar Section - Only show when view is not ViewLessons */}
      {view !== 'ViewLessons' && (
        <div className="w-full md:w-1/2 lg:w-1/3">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-700">Select a Date</h3>
          <Calendar onChange={(date) => { onChange(date); handleDateClick(date); }} value={value} className="custom-calendar" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Selected Date: <span className="text-blue-500">{selectedDate?.toDateString() || 'No date selected'}</span>
          </p>
        </div>
      )}

      {/* Form for AddLessons */}
      {view === 'AddLessons' && (
        <div className="w-full md:w-1/2 lg:w-2/3">
         <form onSubmit={handleFormSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lesson Name</label>
              <input
                type="text"
                name="lesson_name"
                value={formData.lesson_name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              <select
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor, index) => (
                  <option key={instructor.id || index} value={instructor.id}>
                    {instructor.first_name} {instructor.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                maxLength={1} // Single character limit
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={selectedDate }
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Add Lesson</button>
          </form>
        </div>
      )}

      {/* Lessons Display for ViewLessons */}
      {view === 'ViewLessons' && (
        <div className="w-full">
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.map((lesson, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md min-w-[250px] max-w-[400px] w-full">
                  <p className="text-lg font-semibold text-blue-600">{lesson.lesson_name}</p>
                  <p><strong>Start Date:</strong> {new Date(lesson.start_date).toLocaleDateString()}</p>
                  <p><strong>Instructor:</strong> {lesson.instructors?.users?.first_name || 'FN'} {lesson.instructors?.users?.last_name || 'LN'}</p>
                  <p><strong>Cost:</strong> ${lesson.cost || 'N/A'}</p>
                  <p><strong>Total Lessons:</strong> {lesson.total_lessons || 'N/A'}</p>
                  <p><strong>Capacity:</strong> {lesson.capacity || 'N/A'}</p>
                  <p><strong>Status:</strong> {lesson.status || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No lessons available for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
