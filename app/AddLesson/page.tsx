'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function AddLessons() {
  const router = useRouter();
  const [allInstructors, setAllInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [levels, setLevels] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [formData, setFormData] = useState({
    lesson_name: '',
    instrument_id: '',
    level_id: '',
    status: '',
    cost: '',
    total_lessons: '',
    capacity: '',
    start_date: '',
    instructor_id: '',
  });

  useEffect(() => {
    // Mocked data instead of fetch
    const mockInstruments = [
      { instrument_id: '1', instrument_name: 'Guitar' },
      { instrument_id: '2', instrument_name: 'Piano' },
    ];
    const mockLevels = [
      { level_id: '1', level_name: 'Beginner' },
      { level_id: '2', level_name: 'Intermediate' },
    ];
    const mockInstructors = [
      { instructor_id: '1', first_name: 'John', last_name: 'Doe' },
      { instructor_id: '2', first_name: 'Jane', last_name: 'Smith' },
    ];

    setInstruments(mockInstruments);
    setLevels(mockLevels);
    setAllInstructors(mockInstructors);
    setFilteredInstructors(mockInstructors);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'instrument_id' && value) {
      const selectedInstrument = instruments.find(inst => inst.instrument_id === value);
      if (selectedInstrument) {
        setFormData(prev => ({
          ...prev,
          lesson_name: `${selectedInstrument.instrument_name} Lesson`
        }));
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const capacity = parseInt(formData.capacity, 10);
    const cost = parseFloat(formData.cost);
    const totalLessons = parseInt(formData.total_lessons, 10);

    if (capacity > 10) return alert('Capacity cannot be greater than 10.');
    if (isNaN(cost) || cost <= 0) return alert('Invalid cost.');
    if (isNaN(capacity) || capacity <= 0) return alert('Invalid capacity.');
    if (isNaN(totalLessons) || totalLessons <= 0) return alert('Invalid total lessons.');

    alert('Lesson added successfully!');
    router.push('/ViewLessons');
  };

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
              {/* Instrument */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Instrument</label>
                <select
                  name="instrument_id"
                  value={formData.instrument_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                >
                  <option value="">Select Instrument</option>
                  {instruments.map((inst) => (
                    <option key={inst.instrument_id} value={inst.instrument_id}>
                      {inst.instrument_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lesson Name</label>
                <input
                  type="text"
                  name="lesson_name"
                  value={formData.lesson_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                  readOnly
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  name="level_id"
                  value={formData.level_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((lvl) => (
                    <option key={lvl.level_id} value={lvl.level_id}>
                      {lvl.level_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <select
                  name="instructor_id"
                  value={formData.instructor_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                >
                  <option value="">Select Instructor</option>
                  {filteredInstructors.map((inst) => (
                    <option key={inst.instructor_id} value={inst.instructor_id}>
                      {inst.first_name} {inst.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                  type="text"
                  name="status"
                  maxLength={1}
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (Max 10)</label>
                <input
                  type="number"
                  name="capacity"
                  max="10"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
              >
                Add Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
