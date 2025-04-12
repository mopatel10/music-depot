'use client';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { PlusCircle, AlertCircle } from "lucide-react";

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

  const [instructors, setInstructors] = useState([
    { instructor_id: '1', first_name: 'John', last_name: 'Doe' },
    { instructor_id: '2', first_name: 'Jane', last_name: 'Smith' }
  ]);
  const [rooms, setRooms] = useState([
    { room_id: '1', room_type: 'Room A' },
    { room_id: '2', room_type: 'Room B' }
  ]);
  const [lessons, setLessons] = useState([
    { lesson_id: '1', lesson_name: 'Beginner Piano' },
    { lesson_id: '2', lesson_name: 'Intermediate Guitar' }
  ]);
  const [clients, setClients] = useState([
    { client_id: '1', first_name: 'Alice', last_name: 'Brown' },
    { client_id: '2', first_name: 'Bob', last_name: 'White' }
  ]);
  const [error, setError] = useState(null);
  const [instructorError, setInstructorError] = useState(null);
  const [lessonInstructorMap, setLessonInstructorMap] = useState({
    '1': '1', // Math 101 => Instructor John Doe
    '2': '2'  // History 202 => Instructor Jane Smith
  });
  const router = useRouter();

  useEffect(() => {
    // Normally, you'd fetch data here, but for now it's hardcoded
    console.log('Data initialized.');
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'lesson_id' && value) {
      // If a lesson is selected, look up the corresponding instructor
      const instructorId = lessonInstructorMap[value];

      setFormData(prev => ({
        ...prev,
        [name]: value,
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

    // If there's an instructor error, prevent form submission
    if (instructorError) {
      alert('Please select an available instructor for the chosen time and date.');
      return;
    }

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Create New Session
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-8">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {lessons.map((lesson) => (
                    <option key={lesson.lesson_id} value={lesson.lesson_id}>
                      {lesson.lesson_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select
                  name="instructor_id"
                  value={formData.instructor_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${instructorError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300`}
                  required
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst.instructor_id} value={inst.instructor_id}>
                      {inst.first_name} {inst.last_name}
                    </option>
                  ))}
                </select>
                {instructorError && (
                  <div className="flex items-center text-red-500 text-xs mt-1">
                    <AlertCircle size={16} className="mr-1" />
                    <span>{instructorError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Attending Capacity</label>
                <input
                  type="number"
                  name="attendingcapacity"
                  value={formData.attendingcapacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full px-6 py-3 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 focus:ring-4 focus:ring-indigo-300"
              >
                Create Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSessions;
