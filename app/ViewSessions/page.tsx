'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, XCircle } from "lucide-react";

export default function ViewSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching delay
    setTimeout(() => {
      setSessions([
        {
          session_id: 1,
          lessons: { lesson_name: 'Beginner Piano' },
          instructors: { users: { first_name: 'Alice', last_name: 'Smith' } },
          clients: { users: { first_name: 'Bob', last_name: 'Johnson' } },
          date: '2025-04-15T00:00:00Z',
          start_time: '2025-04-15T09:00:00Z',
          end_time: '2025-04-15T10:00:00Z',
          rooms: { room_type: 'Studio A' },
          attendingcapacity: 10,
          cancelled: false,
        },
        {
          session_id: 2,
          lessons: { lesson_name: 'Intermediate Guitar' },
          instructors: { users: { first_name: 'Charlie', last_name: 'Brown' } },
          clients: { users: { first_name: 'Dana', last_name: 'White' } },
          date: '2025-04-16T00:00:00Z',
          start_time: '2025-04-16T11:00:00Z',
          end_time: '2025-04-16T12:00:00Z',
          rooms: { room_type: 'Studio B' },
          attendingcapacity: 12,
          cancelled: true,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleCancel = (sessionId) => {
    alert(`Cancelled session with ID: ${sessionId}`);
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm("Are you sure you want to delete this session?")) {
      alert(`Deleted session with ID: ${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
            Session Management
          </h1>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-xl text-gray-500">Loading sessions...</div>
          ) : sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
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
                    <p><strong>Instructor:</strong> {session.instructors.users.first_name} {session.instructors.users.last_name}</p>
                    <p><strong>Client:</strong> {session.clients.users.first_name} {session.clients.users.last_name}</p>
                    <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}</p>
                    <p><strong>Room:</strong> {session.rooms.room_type}</p>
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
      </div>
    </div>
  );
}
