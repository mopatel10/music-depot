'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function ViewLessons() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded lesson data
  const mockLessons = [
    {
      lesson_id: 1,
      lesson_name: 'Beginner Piano',
      instructors: {
        users: {
          first_name: 'Alice',
          last_name: 'Smith',
        },
      },
      lesson_levels: {
        level_name: 'Beginner',
      },
      status: 'Active',
      cost: 150,
      start_date: '2025-04-15T00:00:00Z',
      capacity: 10,
    },
    {
      lesson_id: 2,
      lesson_name: 'Intermediate Guitar',
      instructors: {
        users: {
          first_name: 'John',
          last_name: 'Doe',
        },
      },
      lesson_levels: {
        level_name: 'Intermediate',
      },
      status: 'Scheduled',
      cost: 180,
      start_date: '2025-05-01T00:00:00Z',
      capacity: 8,
    },
    {
      lesson_id: 3,
      lesson_name: 'Advanced Drums',
      instructors: {
        users: {
          first_name: 'Maria',
          last_name: 'Lopez',
        },
      },
      lesson_levels: {
        level_name: 'Advanced',
      },
      status: 'Cancelled',
      cost: 200,
      start_date: '2025-06-01T00:00:00Z',
      capacity: 6,
    },
  ];

  const handleDeleteLesson = (lessonId) => {
    const confirmDelete = confirm('Are you sure you want to delete this lesson?');
    if (!confirmDelete) return;

    setData((prevData) => prevData.filter((lesson) => lesson.lesson_id !== lessonId));
    alert('Lesson deleted successfully!');
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(mockLessons);
      setLoading(false);
    }, 500); // Simulate loading delay
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
          {loading ? (
            <div className="text-center text-gray-600 text-xl py-12">Loading lessons...</div>
          ) : data.length > 0 ? (
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
                    <p>
                      <strong>Instructor:</strong> {lesson.instructors.users.first_name}{' '}
                      {lesson.instructors.users.last_name}
                    </p>
                    <p>
                      <strong>Level:</strong> {lesson.lesson_levels.level_name}
                    </p>
                    <p>
                      <strong>Status:</strong> {lesson.status}
                    </p>
                    <p>
                      <strong>Cost:</strong> ${lesson.cost}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{' '}
                      {new Date(lesson.start_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {lesson.capacity}
                    </p>
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
