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
  // Hardcoded user data
  const hardcodedUsers: User[] = [
    {
      user_id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      role: "Instructor",
      employment_type: "Full-Time",
    },
    {
      user_id: "2",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone_number: "987-654-3210",
      role: "Student",
    },
  ];

  // State for users list and selected user
  const [users, setUsers] = useState<User[]>(hardcodedUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
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

  // Fetch selected user's details when a user is selected
  useEffect(() => {
    const selectedUser = users.find((user) => user.user_id === selectedUserId);
    if (selectedUser) {
      setFirstName(selectedUser.first_name || "");
      setLastName(selectedUser.last_name || "");
      setEmail(selectedUser.email || "");
      setPhoneNumber(selectedUser.phone_number || "");
      setUserRole(selectedUser.role || "");
      setEmploymentType(selectedUser.employment_type || "");
      setIsEditing(false);
    }
  }, [selectedUserId, users]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate an update without an API call
    const updatedUser = {
      user_id: selectedUserId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      ...(userRole === "Instructor" && { employment_type: employmentType }),
    };

    console.log("Updated User:", updatedUser);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing
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
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing
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
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing
                    ? 'focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                    : 'bg-gray-100 cursor-not-allowed'
                  }`}
              />
            </div>

            {userRole === "Instructor" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing
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
