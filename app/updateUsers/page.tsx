"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Updated User interface
interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  employment_type?: string;
  client_id?: string;
  instructor_id?: string;
}

const UpdateUser = () => {
  // State for users list and selected user
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state with default empty string values
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<string>("");

  const router = useRouter();

  // Reset form when no user is selected
  useEffect(() => {
    if (!selectedUserId) {
      // Reset all form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setUserRole("");
      setEmploymentType("");
      setIsEditing(false);
    }
  }, [selectedUserId]);

  // Fetch users list on component mount
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const response = await fetch('/api/getUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch users list');
        }
        const data = await response.json();
        setUsers(data.users);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchUsersList();
  }, []);

  // Fetch selected user's details when a user is selected
  useEffect(() => {
    const fetchSelectedUserData = async () => {
      if (!selectedUserId) return;

      try {
        const response = await fetch(`/api/getUsers?id=${selectedUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        
        // Populate form fields with default empty string fallback
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
        setUserRole(data.role || "");
        setEmploymentType(data.employment_type || "");
        
        // Reset editing state
        setIsEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchSelectedUserData();
  }, [selectedUserId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/updateUsers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUserId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          ...(userRole === 'Instructor' && { employment_type: employmentType })
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Show success message and disable editing
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-4">Update User Profile</h1>
          
          {/* User Selection Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="">Select a user to edit</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {`${user.first_name} ${user.last_name} (${user.email})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedUserId && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none' 
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none' 
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
            </div>

            {userRole === 'Instructor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none' 
                      : 'bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            )}

            <div className="flex space-x-4">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 text-white font-bold rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
              
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 text-gray-700 font-bold rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;