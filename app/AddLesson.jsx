import React from "react";
import Calendar from "../components/Calendar";
import Home from "../components/users";

function NewSchedule() {


  return (
  
      <div className="flex-grow p-8">
        <Home />
                <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center font-serif">Add Lessons</h1>
         <Calendar />
      </div>
  );
}

export default NewSchedule; 