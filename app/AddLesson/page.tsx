'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function AddLessons() {
  const router = useRouter();
  const [allInstructors, setAllInstructors] = useState([]); // Store all instructors
  const [filteredInstructors, setFilteredInstructors] = useState([]); // Filtered instructors based on level
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

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/getInstructors');
      if (!response.ok) throw new Error('Failed to fetch instructors');
      const result = await response.json();
      setAllInstructors(result);
      setFilteredInstructors(result); // Initially show all instructors
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchInstruments = async () => {
    try {
      const response = await fetch('/api/getInstruments');
      if (!response.ok) throw new Error('Failed to fetch instruments');
      const result = await response.json();
      setInstruments(result);
    } catch (error) {
      console.error('Error fetching instruments:', error);
    }
  };

  const fetchAllLevels = async () => {
    try {
      const response = await fetch('/api/getAllLevels');
      if (!response.ok) throw new Error('Failed to fetch all levels');
      const result = await response.json();
      setLevels(result);
    } catch (error) {
      console.error('Error fetching all levels:', error);
      setLevels([]);
    }
  };



  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    // Update form data with the new value
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Determine which filters to apply based on the field that changed
    if (['level_id', 'instrument_id', 'start_date'].includes(name)) {
      // Build the new form data with the latest change
      const updatedFormData = { ...formData, [name]: value };
      
      // Apply filters based on all three criteria
      if (updatedFormData.level_id || updatedFormData.instrument_id || updatedFormData.start_date) {
        await fetchFilteredInstructors(
          updatedFormData.level_id,
          updatedFormData.instrument_id,
          updatedFormData.start_date
        );
      } else {
        // If all filters are cleared, show all instructors
        setFilteredInstructors(allInstructors);
      }
    }
    
    // Auto-populate lesson name when instrument is selected
    if (name === 'instrument_id' && value) {
      const selectedInstrument = instruments.find(inst => inst.instrument_id.toString() === value);
      if (selectedInstrument) {
        setFormData(prev => ({
          ...prev,
          lesson_name: `${selectedInstrument.instrument_name} Lesson`
        }));
      }
    }
  };

const fetchFilteredInstructors = async (levelId, instrumentId, date) => {
  try {
    // Build query parameters
    let queryParams = [];
    if (levelId) queryParams.push(`levelId=${levelId}`);
    if (instrumentId) queryParams.push(`instrumentId=${instrumentId}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    const response = await fetch(`/api/getFilteredInstructors${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch filtered instructors');
    
    const result = await response.json();
    setFilteredInstructors(result);
    
    // If the currently selected instructor is not in the filtered list, clear the selection
    if (formData.instructor_id && !result.some(instructor => instructor.instructor_id === formData.instructor_id)) {
      setFormData(prev => ({ ...prev, instructor_id: '' }));
    }
  } catch (error) {
    console.error('Error fetching filtered instructors:', error);
    setFilteredInstructors([]);
  }
};

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.instrument_id || !formData.level_id || !formData.status) {
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
        instrument_id: '',
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
    fetchInstruments();
    fetchAllLevels();
    
    // Clear the form data when the component mounts
    setFormData({
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
                <label className="block text-sm font-medium text-gray-700">Instrument</label>
                {instruments.length === 0 ? (
                  <p>Loading instruments...</p>
                ) : (
                  <select
                    name="instrument_id"
                    value={formData.instrument_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    required
                  >
                    <option value="">Select Instrument</option>
                    {instruments.map((inst) => (
                      <option key={inst.instrument_id} value={inst.instrument_id}>
                        {inst.instrument_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lesson Name</label>
                <input
                  type="text"
                  name="lesson_name"
                  value={formData.lesson_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  required
                  placeholder="Lesson name will auto-populate"
                  readOnly
                />
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
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                {filteredInstructors.length === 0 ? (
                  <p>No instructors available for selected level</p>
                ) : (
                  <select
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    required
                  >
                    <option value="">Select Instructor</option>
                    {filteredInstructors.map((inst) => (
                      <option key={inst.instructor_id} value={inst.instructor_id}>
                        {inst.first_name} {inst.last_name}
                      </option>
                    ))}
                  </select>
                )}
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