'use client'; 
import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserPlus,
  FaSignOutAlt,
  FaChevronDown,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaMusic,
} from "react-icons/fa";
import Link from "next/link"; // Use Next.js Link component instead of react-router-dom
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';


interface SidebarProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Sidebar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); 
  const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
  const [clientInstructorOpen, setClientInstructorOpen] = useState<boolean>(false);
  const [sessionOpen, setSessionOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/"); // This will navigate to the home page
  };

  if (!isLoggedIn) {
    return null; // Do not render the sidebar if the user is not logged in
  }

  return (
    <div
      className={`h-screen fixed left-0 top-0 bg-gradient-to-b from-blue-300 to-purple-600 text-white shadow-lg z-10 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} rounded-tr-xl rounded-br-xl`}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-5 right-[-18px] bg-blue-500 text-white p-2 rounded-full shadow-lg transition-transform duration-300 hover:bg-blue-600"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>

      <div className="p-2">
        {/* Title */}
        {!isCollapsed && <h2 className="text-xl font-bold mb-6 pl-3">Your Music Depot</h2>}

        <ul className="space-y-2">
          {/* Lessons */}
          <li>
            <button
              className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-white hover:bg-opacity-20"
              onClick={() => setScheduleOpen(!scheduleOpen)}
            >
              <span className="flex items-center justify-center w-10">
                <FaCalendarAlt />
              </span>
              {!isCollapsed && (
                <>
                  <span className="ml-2">Lessons</span>
                  <FaChevronDown className={`ml-auto transition-transform ${scheduleOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
            {scheduleOpen && !isCollapsed && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link href="/ViewSchedule" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    View Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/AddLesson" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    Add Lesson
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Sessions */}
          <li>
            <button
              className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-white hover:bg-opacity-20"
              onClick={() => setSessionOpen(!sessionOpen)}
            >
              <span className="flex items-center justify-center w-10">
                <FaMusic />
              </span>
              {!isCollapsed && (
                <>
                  <span className="ml-2">Sessions</span>
                  <FaChevronDown className={`ml-auto transition-transform ${sessionOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
            {sessionOpen && !isCollapsed && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link href="/ViewInstructor" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    View Sessions
                  </Link>
                </li>
                <li>
                  <Link href="/ViewClient" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    Add Session
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Client/Instructor */}
          <li>
            <button
              className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-white hover:bg-opacity-20"
              onClick={() => setClientInstructorOpen(!clientInstructorOpen)}
            >
              <span className="flex items-center justify-center w-10">
                <FaUserPlus />
              </span>
              {!isCollapsed && (
                <>
                  <span className="ml-2">Client/Instructor</span>
                  <FaChevronDown className={`ml-auto transition-transform ${clientInstructorOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
            {clientInstructorOpen && !isCollapsed && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link href="/ViewInstructor" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    View Instructor Schedule
                  </Link>
                </li>
                <li>
                  <Link href="/ViewClient" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    View Client Schedule
                  </Link>
                </li>
                <li>
                  <Link href="/Register" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    Add Client/Instructor
                  </Link>
                </li>
                <li>
                  <Link href="/UpdateClientInstructor" className="block p-2 rounded-lg hover:bg-white hover:bg-opacity-20">
                    Update Client/Instructor
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Financials */}
          <li>
            <Link href="/Financials" className="flex items-center p-3 text-lg rounded-lg hover:bg-white hover:bg-opacity-20">
              <span className="flex items-center justify-center w-10">
                <FaMoneyBillWave />
              </span>
              {!isCollapsed && <span className="ml-2">Financials</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Log Out */}
      <div className="p-2">
        <button onClick={handleLogout} className="flex items-center p-3 text-lg rounded-lg hover:bg-white hover:bg-opacity-20">
          <span className="flex items-center justify-center w-10">
            <FaSignOutAlt />
          </span>
          {!isCollapsed && <span className="ml-2">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
