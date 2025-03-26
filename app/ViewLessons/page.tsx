'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from "lucide-react";

export default function ViewLessons() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/schedules?view=ViewLessons');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
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
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Lesson Catalog
          </h1>
        </div>

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
      </div>
    </div>
  );
}