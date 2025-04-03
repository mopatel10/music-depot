'use client';

import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import '@/public/styles/globals.css';
import { Trash2, XCircle, Edit, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CalendarGfg({ view }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]);
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

    // Validation for required fields
    if (!formData.lesson_name || !formData.level_id || !formData.status) {
      return alert('Please fill all required fields.');
    }

    const capacity = parseInt(formData.capacity, 10);
    const cost = parseFloat(formData.cost);
    const totalLessons = parseInt(formData.total_lessons, 10);

    // Validation for capacity
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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
  <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
    {/* Header with Dynamic Title */}
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
        {view === 'ViewSessions' && 'Session Management'}
        {view === 'AddLessons' && 'Create New Lesson'}
        {view === 'ViewLessons' && 'Lesson Catalog'}
      </h1>
    </div>

 {/* Sessions View */}
 {view === 'ViewSessions' && (
          <div className="p-6">
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3 relative group"
                  >
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCancel(session.session_id)} 
                        className="text-orange-500 hover:text-orange-700 bg-orange-50 p-2 rounded-full"
                      >
                        <XCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSession(session.session_id)} 
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-blue-900 mb-2">{session.lessons.lesson_name}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p><strong>Instructor:</strong> {session.instructors?.users?.first_name} {session.instructors?.users?.last_name}</p>
                      <p><strong>Level:</strong> {session.lessons?.lesson_levels?.level_name}</p>
                      <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}</p>
                      <p><strong>Room:</strong> {session.rooms?.room_type}</p>
                      <p><strong>Capacity:</strong> {session.attendingcapacity}</p>
                      {session.cancelled && (
                        <span className="text-red-500 font-semibold">Cancelled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xl">No sessions available</p>
              </div>
            )}
          </div>
        )}

      {/* Form for AddLessons */}

        {view === 'AddLessons' && (
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

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 bg-gradient-to-b from-blue-300 to-purple-600">Add Lesson</button>
        </form>
        </div>
      )}

        {/* View Lessons */}
        {view === 'ViewLessons' && (
          <div className="p-6">
            {data && data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((lesson, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3 relative group"
                  >
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteLesson(lesson.lesson_id)} 
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-blue-900 mb-2">{lesson.lesson_name}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p><strong>Instructor:</strong> {lesson.instructors?.users?.first_name || 'N/A'} {lesson.instructors?.users?.last_name || ''}</p>
                      <p><strong>Level:</strong> {lesson.lesson_levels.level_name}</p>
                      <p><strong>Status:</strong> {lesson.status}</p>
                      <p><strong>Cost:</strong> ${lesson.cost}</p>
                      <p><strong>Start Date:</strong> {new Date(lesson.start_date).toLocaleDateString()}</p>
                      <p><strong>Capacity:</strong> {lesson.capacity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xl">No lessons found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

