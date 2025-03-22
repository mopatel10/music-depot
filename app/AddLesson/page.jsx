'use client'; 
import React from "react";
import CalendarGfg from "../components/Calendar";

function AddLessons() {


  return (
      <div className="flex-grow p-8">

                <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center font-serif">Add Lessons</h1>
         <CalendarGfg view="AddLessons"/>
      </div>
  );
}

export default AddLessons; 