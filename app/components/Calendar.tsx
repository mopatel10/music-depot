'use client'; 
import React, { useState } from "react";

type CalendarProps = {
  isView: boolean;
};

type Nullable<T> = T | null;

const Calendar: React.FC<CalendarProps> = ({ isView }) => {
  const [selectedDate, setSelectedDate] = useState<Nullable<number>>(null);
  const [selectedTime, setSelectedTime] = useState<Nullable<string>>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Nullable<string>>(null);
  const [selectedRoom, setSelectedRoom] = useState<Nullable<string>>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const timeSlots: string[] = Array.from({ length: 9 }, (_, i) => `${9 + i}:00 AM`);
  const instructors: string[] = ["Instructor A", "Instructor B", "Instructor C"];
  const rooms: string[] = ["Room 101", "Room 102", "Room 103"];

  const getDaysInMonth = (month: number, year: number): number[] => {
    return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
  };

  const handleDayClick = (day: number) => setSelectedDate(day);

  const getStartOfMonthDay = (): number => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleFormSubmit = () => {
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime} with ${selectedInstructor} in ${selectedRoom}`);
  };

  const daysInCurrentMonth = getDaysInMonth(currentMonth.getMonth() + 1, currentMonth.getFullYear());
  const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const emptyDays = getStartOfMonthDay();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto text-center">
      <h3 className="text-2xl font-bold mb-4">
        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
      </h3>
      <div className="grid grid-cols-7 font-bold bg-gradient-to-b from-blue-300 to-purple-600 text-white p-2 rounded">
        {daysOfWeek.map((weekday) => (
          <div key={weekday} className="text-center p-1">{weekday}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: emptyDays }, (_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}
        {daysInCurrentMonth.map((day) => {
          const isSelected = selectedDate === day;
          const isToday = todayDate === day && todayMonth === currentMonth.getMonth() && todayYear === currentMonth.getFullYear();
          return (
            <div
              key={day}
              className={`h-10 w-10 flex items-center justify-center border rounded-md cursor-pointer transition 
                ${isSelected ? "bg-blue-500 text-white border-blue-700" : "bg-white border-gray-300"} 
                ${isToday ? "bg-red-500 text-black border-black font-bold" : ""} hover:bg-blue-200`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="mt-6 p-4 rounded-lg shadow-md bg-gray-100">
          {isView ? (
            <h4 className="text-lg font-semibold text-blue-500">Viewing schedule for {selectedDate}</h4>
          ) : (
            <>
              <h4 className="text-lg font-semibold text-blue-500">Book a Lesson on {selectedDate}</h4>
              <select className="block w-full p-2 mt-2 border rounded" onChange={(e) => setSelectedTime(e.target.value)}>
                <option value="">Select Time</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
              <input type="text" placeholder="Search by client name" className="block w-full p-2 mt-2 border rounded" />
              <select className="block w-full p-2 mt-2 border rounded" onChange={(e) => setSelectedInstructor(e.target.value)}>
                <option value="">Select Instructor</option>
                {instructors.map((instructor, index) => (
                  <option key={index} value={instructor}>{instructor}</option>
                ))}
              </select>
              <select className="block w-full p-2 mt-2 border rounded" onChange={(e) => setSelectedRoom(e.target.value)}>
                <option value="">Select Room</option>
                {rooms.map((room, index) => (
                  <option key={index} value={room}>{room}</option>
                ))}
              </select>
              <button
                className="w-full bg-green-500 text-white p-2 mt-3 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                onClick={handleFormSubmit}
                disabled={!selectedTime || !selectedInstructor || !selectedRoom}
              >
                Confirm Booking
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;