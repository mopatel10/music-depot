'use client';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function AddSessions() {
  const [formData, setFormData] = useState({
    lesson_id: '',        
    instructor_id: '',
    room_id: '',
    start_time: '',
    end_time: '',
    cancelled: false,
    attendingcapacity: '',
    date: '',
  });

  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lessons, setLessons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [lessonsRes, instructorsRes, roomsRes] = await Promise.all([
          fetch('/api/getLessons'),
          fetch('/api/getInstructors'),
          fetch('/api/getRooms'),
        ]);
        if (lessonsRes.ok) setLessons(await lessonsRes.json());
        if (instructorsRes.ok) setInstructors(await instructorsRes.json());
        if (roomsRes.ok) setRooms(await roomsRes.json());
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
      [name]: type === 'checkbox' ? checked : value,
    }));
    
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.lesson_id || !formData.instructor_id || !formData.room_id || !formData.start_time || !formData.end_time) {
      return alert('Please fill all required fields.');
    }
  
    const attendingCapacity = parseInt(formData.attendingcapacity, 10);
  
    if (isNaN(attendingCapacity) || attendingCapacity <= 0) {
      return alert('Invalid attending capacity. Please enter a valid number.');
    }
  
    // Ensure start_time and end_time are in ISO format
    const startTime = new Date(formData.start_time).toISOString();
    const endTime = new Date(formData.end_time).toISOString();
  
    // If a date is provided, convert it to Date format (optional)
    const date = formData.date ? new Date(formData.date).toISOString().split('T')[0] : null;
  
    try {
      const response = await fetch('/api/addSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_time: startTime,
          end_time: endTime,
          date,  // This will be null if not provided
          attendingcapacity: attendingCapacity,
        }),
      });
      if (!response.ok) throw new Error('Failed to add lesson schedule');
      alert('Lesson schedule added successfully!');
      setFormData({
        lesson_id: '',
        instructor_id: '',
        room_id: '',
        start_time: '',
        end_time: '',
        cancelled: false,
        attendingcapacity: '',
        date: '',
      });
      router.push("/ViewSessions");
    } catch (error) {
      console.error('Error adding lesson schedule:', error);
      alert('Failed to add lesson schedule');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-6 sm:px-12">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-blue-900 text-center">Add Session</h1>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lesson</label>
              <select name="lesson_id" value={formData.lesson_id} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Lesson</option>
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <option key={lesson.lesson_id} value={lesson.lesson_id}>
                      {lesson.lesson_name}
                    </option>
                  ))
                ) : (
                  <option value="">No lessons available</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              <select name="instructor_id" value={formData.instructor_id} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Instructor</option>
                {instructors.length > 0 ? (
                  instructors.map((inst) => (
                    <option key={inst.instructor_id} value={inst.instructor_id}>
                      {inst.first_name} {inst.last_name}
                    </option>
                  ))
                ) : (
                  <option value="">No instructors available</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room</label>
              <select name="room_id" value={formData.room_id} onChange={handleInputChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Room</option>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_type}
                    </option>
                  ))
                ) : (
                  <option value="">No rooms available</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Attending Capacity</label>
              <input
                type="number"
                name="attendingcapacity"
                value={formData.attendingcapacity}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="cancelled"
                checked={formData.cancelled}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Cancelled</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 bg-gradient-to-b from-blue-300 to-purple-600"
          >
            Add Lesson Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSessions;
