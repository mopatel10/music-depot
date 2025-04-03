import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const clientId = req.nextUrl.searchParams.get('id');
    
    // Set up the where clause for the query
    let whereClause = {
      client_id: {
        not: null, // Base condition: ensure client_id is not null
      }
    };
    
    // If clientId is provided in the request, add it to the where clause
    if (clientId) {
      whereClause = {
        ...whereClause,
        client_id: clientId, // Override with specific client_id
      };
    }
    
    // Fetch scheduled sessions along with related data (instructors, lessons, rooms)
    const sessions = await prisma.lesson_schedule.findMany({
      where: whereClause,
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
