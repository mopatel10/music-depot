'use client';
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configure date-fns localizer
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface ClientSchedule {
  date: string;
  start: string;
  end: string;
  title: string;
  client_first_name: string;
  client_last_name: string;
  lesson_name: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to convert 'HH:mm' to a Date object
  const convertToDate = (dateString: string, timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(`${dateString}T00:00:00Z`); // Ensure the date is in UTC
    date.setHours(hours, minutes); // Set the correct hours and minutes
    return date;
  };

  // Fetch the data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/getClientSchedules");
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data: ClientSchedule[] = await response.json();

        // Map API response to Big Calendar events
        const mappedEvents = data.map((schedule) => {
          const { date, start, end, client_first_name, client_last_name, lesson_name } = schedule;

          const startDate = convertToDate(date, start);
          const endDate = convertToDate(date, end);

          return {
            title: `${client_first_name} ${client_last_name} - ${lesson_name}`,
            start: startDate,
            end: endDate,
          };
        });

        setEvents(mappedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight">
              Client Schedule
            </h1>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-[75vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={["month", "week", "day", "agenda"]}
              className="p-4"
              style={{
                height: "75vh",
              }}
              dayPropGetter={(date) => {
                const dayOfWeek = date.getDay();
                const isToday = date.toDateString() === new Date().toDateString();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return {
                  className: `
                    ${isWeekend ? 'bg-gray-50' : 'bg-white'}
                    ${isToday ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}
                    hover:bg-indigo-50 transition-colors duration-200
                  `,
                };
              }}
              eventPropGetter={(event) => ({
                className: `
                  bg-gradient-to-r from-indigo-600 to-purple-600 
                  text-white 
                  rounded-lg 
                  p-2 
                  text-sm 
                  font-semibold 
                  shadow-md 
                  hover:scale-[1.02] 
                  transition-transform 
                  duration-200
                `,
              })}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Toolbar Component
const CustomToolbar = (toolbar: any) => {
  return (
    <div className="rbc-toolbar flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => toolbar.onNavigate('PREV')} 
          className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Prev
        </button>
        <button 
          onClick={() => toolbar.onNavigate('TODAY')} 
          className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Today
        </button>
        <button 
          onClick={() => toolbar.onNavigate('NEXT')} 
          className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Next
        </button>
      </div>
      <div className="text-xl font-semibold text-gray-800">
        {toolbar.label}
      </div>
      <div className="flex items-center space-x-2">
        {toolbar.views.map((view: string) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`
              px-3 py-1 rounded-md transition-colors
              ${toolbar.view === view 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;