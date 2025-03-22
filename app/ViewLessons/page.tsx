
'use client'; // Add this at the top of your file

import React from "react";
import Calendar from "../components/Calendar";

function ViewLessons() {

  return (
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center">View Lessons Schedules</h1>
         <Calendar view="ViewLessons" />
      </div>
  );
}

export default ViewLessons; 
