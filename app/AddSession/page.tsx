'use client';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

function AddSessions() {
  const [formData, setFormData] = useState({
    lesson_id: '',        
    instructor_id: '',
    room_id: '',
    client_id: '',  
    start_time: '',
    end_time: '',
    cancelled: false,
    attendingcapacity: '',
    date: '',
  });

  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [clients, setClients] = useState([]);
  const [lessonInstructorMap, setLessonInstructorMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [lessonsRes, instructorsRes, roomsRes, clientsRes] = await Promise.all([
          fetch('/api/getLessons'),
          fetch('/api/getInstructors'),
          fetch('/api/getRooms'),
          fetch('/api/getClients')
        ]);
        
        let lessonsData = [];
        let instructorMap = {};
        
        if (lessonsRes.ok) {
          lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
          
          // Create a map of lesson_id to instructor_id from the lessons data
          instructorMap = lessonsData.reduce((map, lesson) => {
            // Your getLessons API doesn't return instructor_id directly in the formatted data
            // But we can extract it from the instructor_name
            map[lesson.lesson_id] = lesson.instructor_id;
            return map;
          }, {});
          
          setLessonInstructorMap(instructorMap);
        }
        
        if (instructorsRes.ok) setInstructors(await instructorsRes.json());
        if (roomsRes.ok) setRooms(await roomsRes.json());
        if (clientsRes.ok) setClients(await clientsRes.json());
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Fetch available rooms dynamically based on selected date and/or time
  useEffect(() => {
    // Only fetch if all necessary fields are provided.
    if (!formData.date || !formData.start_time || !formData.end_time) return;

    console.log("Fetching available rooms with:", {
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
    });

    async function fetchAvailableRooms() {
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams({
          date: formData.date,
          start_time: formData.start_time, 
          end_time: formData.end_time,
        });
        // Call the new API endpoint
        const response = await fetch(`/api/getAvailableRooms?${queryParams.toString()}`);
        if (response.ok) {
          const availableRooms = await response.json();

          console.log("Available rooms received:", availableRooms);

          setRooms(availableRooms);
        } else {
          // If there is an error, clear the rooms (or handle it as needed)
          setRooms([]);
          console.error("Error fetching available rooms");
        }
      } catch (error) {
        console.error("Error in fetchAvailableRooms:", error);
      }
    }
    fetchAvailableRooms();
  }, [formData.date, formData.start_time, formData.end_time]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log("handleInputChange =>", name, value);
    
    if (name === 'lesson_id' && value) {
      // If a lesson is selected, look up the corresponding instructor
      const instructorId = lessonInstructorMap[value];
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Auto-fill the instructor if we have a matching instructor
        instructor_id: instructorId || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.lesson_id || !formData.instructor_id || !formData.room_id || !formData.client_id || !formData.start_time || !formData.end_time) {
      return alert('Please fill all required fields.');
    }
  
    const attendingCapacity = parseInt(formData.attendingcapacity, 10);
  
    if (isNaN(attendingCapacity) || attendingCapacity <= 0) {
      return alert('Invalid attending capacity. Please enter a valid number.');
    }
  
    const startTime = new Date(formData.start_time).toISOString();
    const endTime = new Date(formData.end_time).toISOString();

    let date = null;
    if (formData.date) {
      const localDate = new Date(formData.date + "T00:00:00");
      const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
      date = adjustedDate;
    }

  
    try {
      const response = await fetch('/api/addSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_time: startTime,
          end_time: endTime,
          date,
          attendingcapacity: attendingCapacity,
        }),
      });
      if (!response.ok) throw new Error('Failed to add lesson schedule');
      alert('Lesson schedule added successfully!');
      setFormData({
        lesson_id: '',
        instructor_id: '',
        room_id: '',
        client_id: '',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Create New Session
          </h1>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lesson Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lesson</label>
                <select 
                  name="lesson_id" 
                  value={formData.lesson_id} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                >
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

              {/* Instructor Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select 
                  name="instructor_id" 
                  value={formData.instructor_id} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                  disabled={formData.lesson_id !== ''} // Disable when a lesson is selected
                >
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
                {formData.lesson_id !== '' && (
                  <p className="text-xs text-blue-600 mt-1">
                    Instructor auto-selected based on lesson
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <select 
                  name="room_id" 
                  value={formData.room_id} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                >
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

              {/* Client Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <select 
                  name="client_id" 
                  value={formData.client_id} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No clients available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
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
                <label className="block text-sm font-medium text-gray-700">End Time</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attending Capacity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Attending Capacity</label>
                <input
                  type="number"
                  name="attendingcapacity"
                  value={formData.attendingcapacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
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
              {/* Cancelled Checkbox */}
              <div className="flex items-center space-x-3 pt-6">
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

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <PlusCircle size={24} />
              <span>Add Lesson Schedule</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSessions;