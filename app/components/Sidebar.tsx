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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC<{ onToggle?: (collapsed: boolean) => void }> = ({ onToggle }) => {
  const { isLoggedIn, setIsLoggedIn, userRole } = useAuth();
  const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
  const [clientInstructorOpen, setClientInstructorOpen] = useState<boolean>(false);
  const [sessionOpen, setSessionOpen] = useState<boolean>(false);
  const [financialsOpen, setFinancialsOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  // Updated render condition functions for different roles
  const canViewLessons = () => ['admin', 'instructor', 'client'].includes(userRole);
  const canManageLessons = () => ['admin', 'instructor'].includes(userRole);
  const canViewSessions = () => ['admin', 'instructor', 'client'].includes(userRole);
  const canManageSessions = () => ['admin', 'instructor'].includes(userRole);
  const canViewClientSchedule = () => ['admin','client'].includes(userRole);
  const canViewInstructorSchedule = () => ['instructor', 'admin'].includes(userRole);
  const canManageUsers = () => ['admin'].includes(userRole);
  const canViewFinancials = () => ['admin'].includes(userRole);
  const canManageFinancials = () => ['admin'].includes(userRole);

  return (
    <div
      className={`h-screen fixed left-0 top-0 bg-gradient-to-b from-blue-300 to-purple-600 text-white shadow-lg z-10 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} rounded-tr-xl rounded-br-xl`}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-5 right-[-18px] text-white p-2 rounded-full shadow-lg transition-transform duration-300"
        onClick={toggleSidebar}
      >
        {!isCollapsed ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>

      <div className="p-2">
        {/* Title */}
        {!isCollapsed && <h2 className="text-xl font-bold mb-6 pl-3 ">Your Music Depot</h2>}

        <ul className="space-y-2">
          {/* Lessons */}
          {canViewLessons() && (
            <li>
              <button
                className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-blue-700 hover:bg-opacity-20"
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
                    <Link href="/ViewLessons" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                      View Lessons
                    </Link>
                  </li>
                  {canManageLessons() && (
                    <li>
                      <Link href="/AddLesson" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                        Add Lesson
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Sessions */}
          {canViewSessions() && (
            <li>
              <button
                className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-blue-700 hover:bg-opacity-20"
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
                    <Link href="/ViewSessions" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                      View Sessions
                    </Link>
                  </li>
                  {canManageSessions() && (
                    <li>
                      <Link href="/AddSession" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                        Add Session
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Client/Instructor Management */}
          {(canManageUsers() || canViewClientSchedule() || canViewInstructorSchedule()) && (
            <li>
              <button
                className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-blue-700 hover:bg-opacity-20"
                onClick={() => setClientInstructorOpen(!clientInstructorOpen)}
              >
                <span className="flex items-center justify-center w-10">
                  <FaUserPlus />
                </span>
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Schedules</span>
                    <FaChevronDown className={`ml-auto transition-transform ${clientInstructorOpen ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
              {clientInstructorOpen && !isCollapsed && (
                <ul className="pl-6 space-y-2">
                  {canViewInstructorSchedule() && (
                    <li>
                      <Link href="/ViewInstructor" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                        View Instructor Schedule
                      </Link>
                    </li>
                  )}
                  {canViewClientSchedule() && (
                    <li>
                      <Link href="/ViewClient" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                        View Client Schedule
                      </Link>
                    </li>
                  )}
                  {canManageUsers() && (
                    <>
                      <li>
                        <Link href="/Register" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                          Add Client/Instructor
                        </Link>
                      </li>
                      <li>
                        <Link href="/updateUsers" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                          Update Client/Instructor
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Financials */}
          {canViewFinancials() && (
            <li>
              <button
                className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-blue-700 hover:bg-opacity-20"
                onClick={() => setFinancialsOpen(!financialsOpen)}
              >
                <span className="flex items-center justify-center w-10">
                  <FaMoneyBillWave />
                </span>
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Financials</span>
                    <FaChevronDown className={`ml-auto transition-transform ${financialsOpen ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
              {financialsOpen && !isCollapsed && (
                <ul className="pl-6 space-y-2">
                  <li>
                    <Link href="/ViewFinancials" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                      View Financials
                    </Link>
                  </li>
                  {canManageFinancials() && (
                    <li>
                      <Link href="/AddFinancial" className="block p-2 rounded-lg hover:bg-purple-600 hover:bg-opacity-20">
                        Add Financials
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* Log Out */}
      <div className="p-2">
        <button onClick={handleLogout} className="flex items-center p-3 text-lg rounded-lg hover:bg-opacity-20 bg-gradient-to-b from-blue-300 to-purple-600">
          <span className="flex items-center justify-center w-10 ">
            <FaSignOutAlt />
          </span>
          {!isCollapsed && <span className="ml-2 ">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;