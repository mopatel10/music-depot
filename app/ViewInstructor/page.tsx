'use client';
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configure date-fns localizer
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface InstructorSchedule {
  date: string;
  start_time: string;
  end_time: string;
  instructor_id: string;
  instructor_fn: string;
  instructor_ln: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Function to convert date and time into a Date object
  const convertToDate = (dateString: string, timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(`${dateString}T00:00:00Z`); // Set the date to midnight UTC
    date.setHours(hours, minutes); // Set the correct hours and minutes in UTC
    return date;
  };

  // Fetch the data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/getInstSchedules");
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data: InstructorSchedule[] = await response.json();

        // Map API response to Big Calendar events
        const mappedEvents = data.map((schedule) => {
          const { date, start_time, end_time, instructor_fn, instructor_ln } = schedule;

          const startDate = convertToDate(date, start_time); // Convert start time to Date object
          const endDate = convertToDate(date, end_time); // Convert end time to Date object

          return {
            title: `${instructor_fn} ${instructor_ln}`,
            start: startDate,
            end: endDate,
          };
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-blue-900">Instructor Schedule</h1>
      <div className="w-full max-w-4xl rounded-lg shadow-xl overflow-hidden bg-white">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          style={{
            height: "75vh", // Set calendar height
          }}
          // Day styling with custom theme
          dayPropGetter={(date) => {
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            return {
              style: {
                backgroundColor: isWeekend ? "#f0f4f8" : "#ffffff", // Light gray for weekends, white for weekdays
                border: "1px solid #e5e7eb", // Subtle border
              },
            };
          }}
          // Event styling with custom theme
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#8E24AA", // Purple color for events
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 12px",
              fontWeight: "bold",
            },
          })}
          // Header styling
          toolbarPropGetter={() => ({
            style: {
              backgroundColor: "#3b82f6", // Blue background for the header
              color: "#ffffff", // White text in the header
              padding: "10px",
              fontSize: "16px",
              fontWeight: "bold",
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
