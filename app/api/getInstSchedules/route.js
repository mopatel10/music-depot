import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch instructor availability from the database
    const instructorSchedules = await prisma.instructor_availability.findMany({
      select: {
        date: true,  // Added the date field
        start_time: true,
        end_time: true,
        instructors: {
          select: {
            instructor_id: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Format the result to return the necessary data
    const schedules = instructorSchedules.map((schedule) => {
      // Extract start and end times as Date objects
      const start_time = new Date(schedule.start_time);
      const end_time = new Date(schedule.end_time);

      // Extract the date from the database
      const formattedDate = schedule.date ? schedule.date.toISOString().split("T")[0] : null; // 'YYYY-MM-DD'

      // Convert times to 'HH:mm' format
      const formattedStartTime = `${start_time.getHours().toString().padStart(2, '0')}:${start_time.getMinutes().toString().padStart(2, '0')}`;
      const formattedEndTime = `${end_time.getHours().toString().padStart(2, '0')}:${end_time.getMinutes().toString().padStart(2, '0')}`;

      return {
        date: formattedDate,  // Return the formatted date
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        instructor_id: schedule.instructors.instructor_id,
        instructor_fn: schedule.instructors.users.first_name,
        instructor_ln: schedule.instructors.users.last_name, // Assuming only one user per instructor
      };
    });
    console.log(schedules);
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching instructor schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor schedules" },
      { status: 500 }
    );
  }
}
