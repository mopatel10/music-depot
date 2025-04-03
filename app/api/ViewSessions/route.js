import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch scheduled sessions  (instructors, lessons, rooms)
    const sessions = await prisma.lesson_schedule.findMany({
      select: {
        session_id: true,
        start_time: true,
        end_time: true,
        date: true,
        cancelled: true,
        attendingcapacity: true,
        instructors: {
          select: {
            instructor_id: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        clients: {
          select: {
            client_id: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        lessons: {
          select: {
            lesson_id: true,
            lesson_name: true,
            status: true,
            cost: true,
            capacity: true,
            lesson_levels: {
              select: {
                level_name: true,
              },
            },
          },
        },
        rooms: {
          select: {

            room_type: true,

          },
        },
      },
    });

    // Return the session data in the response
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.error();
  }
}
