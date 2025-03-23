'use client';

import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import '@/public/styles/globals.css';
import { Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CalendarGfg({ view }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]); // State for sessions
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

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/ViewSessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const result = await response.json();
      setSessions(result);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await fetch(`/api/deleteLesson/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted lesson from the UI state
        setData((prevData) => prevData.filter((lesson) => lesson.lesson_id !== lessonId));
        alert('Lesson deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('An error occurred while deleting the lesson');
    }
  };

  useEffect(() => {
    if (view === 'ViewLessons') fetchData();
    else if (view === 'ViewSessions') fetchSessions(); 
    else if (view === 'AddLessons') fetchInstructors();
  }, [view]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (view === 'AddLessons') {
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
    } else {
      fetchData(date);
    }
  };

  const handleCancel = async (sessionId: any) => {
    try {
      const response = await fetch(`/api/UpdateSession`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, cancelled: true }),
      });
  
      if (!response.ok) throw new Error('Failed to cancel session');
  
      alert('Session successfully cancelled!');
      fetchSessions();
      // Refresh sessions or update local state here if needed
    } catch (error) {
      console.error('Error cancelling session:', error);
      alert('Error cancelling session. Please try again.');
    }
  };
  const handleDeleteSession = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
  
    try {
      const response = await fetch(`/api/DeleteSession/${sessionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId }),
      });
  
      if (!response.ok) throw new Error("Failed to delete session");
  
      alert("Session deleted successfully!");
      fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Error deleting session. Please try again.");
    }
  };
  
  

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'instructor_id' && value) {
      console.log(value);
      // Fetch levels for the selected instructor
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

    // Validate capacity
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

  return (
    <div className="flex flex-col md:flex-row items-start bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6 md:space-y-0 md:space-x-6">

      {/* Display Sessions for ViewSessions */}
      
      {view === 'ViewSessions' && (
        <div className="w-full">
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sessions.map((session, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md min-w-[250px] max-w-[400px] w-full relative">
                  <p className="text-xl font-semibold mb-2">{session.lessons.lesson_name}</p>
                  <p className="mb-1"><strong>Instructor:</strong> {session.instructors?.users?.first_name} {session.instructors?.users?.last_name}</p>
                  <p className="mb-1"><strong>Level:</strong> {session.lessons?.lesson_levels?.level_name}</p>
                  <p className="mb-1"><strong>Cost:</strong> ${session.lessons.cost}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Start Time:</strong> {new Date(session.start_time).toLocaleTimeString()}</p>
                  <p className="mb-1"><strong>End Time:</strong> {new Date(session.end_time).toLocaleTimeString()}</p>
                  <p className="mb-1"><strong>Room:</strong> {session.rooms?.room_type}</p>
                  <p className="mb-1"><strong>Capacity:</strong> {session.attendingcapacity}</p>
                  <p><strong>Cancelled:</strong> {session.cancelled ? 'Yes' : 'No'}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-4">
                  <button onClick={() => handleCancel(session.session_id)} className="flex items-center gap-1 text-orange-500 hover:text-orange-700 bg-gradient-to-b from-blue-300 to-purple-600">
                    <XCircle size={20} /> Cancel
                  </button>
                  <button onClick={() => handleDeleteSession(session.session_id)} className="flex items-center gap-1 bg-gradient-to-b from-blue-300 to-purple-600 hover:text-red-500">
                    <Trash2 size={20} /> Delete
                  </button>
                </div>

                </div>
              ))}
            </div>
        ) : (
          <p>No sessions found.</p>
        )}
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
                value={formData.lesson_name} // Corrected to match formData
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              {instructors.length === 0 ? (
                <p>Loading instructors...</p>
              ) : (
                <select name="instructor_id" value={formData.instructor_id} onChange={handleInputChange} required>
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
              <select name="level_id" value={formData.level_id} onChange={handleInputChange} required>
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
                value={formData.start_date}
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
                    <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md min-w-[250px] max-w-[400px] w-full relative">
                      {/* Delete Button */}
                      <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDeleteLesson(lesson.lesson_id)} // Pass lesson id to handleDeleteLesson
                      >
                        🗑️
                      </button>

                      <p className="text-lg font-semibold">{lesson.lesson_name}</p>
                      <p><strong>Instructor:</strong> {lesson.instructors?.users?.first_name || 'FN'} {lesson.instructors?.users?.last_name || 'LN'}</p>
                      <p><strong>Level:</strong> {lesson.lesson_levels.level_name}</p>
                      <p><strong>Status:</strong> {lesson.status}</p>
                      <p><strong>Cost:</strong> ${lesson.cost}</p>
                      <p><strong>Start Date:</strong> {new Date(lesson.start_date).toLocaleDateString()}</p>
                      <p><strong>Capacity:</strong> {lesson.capacity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No lessons found for this date.</p>
              )}
            </div>
          )}
    </div>
  );
}
